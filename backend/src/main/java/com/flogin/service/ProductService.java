package com.flogin.service;

import com.flogin.dto.ProductDTO;
import com.flogin.entity.CategoryEntity;
import com.flogin.entity.ProductEntity;
import com.flogin.repository.CategoryRepository;
import com.flogin.repository.ProductRepository;
import com.flogin.ProductMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public ProductService(CategoryRepository categoryRepository, ProductRepository productRepository, ProductMapper productMapper) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

    //Phải kiểm tra tham số truyền vào có null không.
    //Đảm bảo toàn vẹn dữ liệu (Thành công hết, nếu sai 1 bước thì rollback)
    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO){

        if(productDTO == null){
            throw new IllegalArgumentException("Tham số truyền vào productDTO không được null");
        }

        //Tìm không thấy => ném Exception
        CategoryEntity categoryEntity = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy Category với ID: " + productDTO.getCategoryId()
                ));

        ProductEntity productEntity = new ProductEntity();
        productEntity.setName(productDTO.getName());
        productEntity.setPrice(productDTO.getPrice());
        productEntity.setQuantity(productDTO.getQuantity());
        productEntity.setDescription(productDTO.getDescription());
        productEntity.setCategory(categoryEntity);

        ProductEntity savedProductEntity = productRepository.save(productEntity);

        return productMapper.toDTO(savedProductEntity);
    }

    /*
    readOnly = true	Tối ưu hiệu năng. Báo Hibernate bỏ qua "Dirty Checking".
    @Transactional	Quản lý Session. Giữ Session mở trong suốt hàm Service để tránh lỗi LazyInitializationException
    (ngay cả khi bạn đã dùng JOIN FETCH, đây vẫn là một "lưới an toàn" tốt).
     */
    @Transactional(readOnly = true)
    public List<ProductDTO> getAllProducts(Integer categoryId){
        List<ProductEntity> productEntityList;
        if(categoryId == null){
            productEntityList = productRepository.findAllWithCategory();
        }
        else{
            productEntityList = productRepository.findAllByCategoryId(categoryId);
        }

        return productEntityList.stream().map(productMapper::toDTO).toList();
    }
    //Phân trang
    public Page<ProductDTO> getAllProductsPaginated(Integer categoryId, int page, int pageSize){

        // 1. Tạo đối tượng Pageable (chỉ định trang nào, bao nhiêu phần tử)
        Pageable pageable = PageRequest.of(page, pageSize);

        Page<ProductEntity> productEntityPage;

        //2. Gọi hàm Repository tương ứng
        if(categoryId == null){
            productEntityPage = productRepository.findAllWithCategoryPaginated(pageable);
        }
        else{
            productEntityPage = productRepository.findAllByCategoryIdWithCategoryPaginated(categoryId, pageable);
        }

        // 3. Dùng hàm .map() có sẵn của Page để chuyển đổi Page<Entity> -> Page<DTO>
        // Nó sẽ tự động gọi productMapper.toDTO cho từng sản phẩm trong trang
        return productEntityPage.map(productMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public ProductDTO getProductByID(Integer productId){
        ProductEntity productEntity = productRepository.findById(productId).orElseThrow(
                () -> new EntityNotFoundException("Không tìm thấy sản phẩm với ID: " + productId)
        );

        return productMapper.toDTO(productEntity);
    }

    /*
    GIỮ các annotation (@NotNull, @NotBlank...) trên các trường (field) của ProductDTO.

    GIỮ các kiểm tra if (var == null) thủ công bên trong các phương thức của ProductService.
     */
    @Transactional
    public ProductDTO updateProduct(
            Integer productId, ProductDTO productDTO
    ){
        if(productId == null){
            throw new IllegalArgumentException("Tham số truyền vào productId không được null");
        }
        if(productDTO == null){
            throw new IllegalArgumentException("Tham số truyền vào productDTO không được null");
        }

        //Tìm không thấy => ném Exception
        CategoryEntity categoryEntity = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy Category với ID: " + productDTO.getCategoryId()
                ));

        ProductEntity productEntity = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException(
                     "Không tìm thấy sản phẩm với ID: " + productId
                ));

        productEntity.setName(productDTO.getName());
        productEntity.setPrice(productDTO.getPrice());
        productEntity.setQuantity(productDTO.getQuantity());
        productEntity.setDescription(productDTO.getDescription());
        productEntity.setCategory(categoryEntity);

        return productMapper.toDTO(productEntity);
    }

    @Transactional
    public void deleteProduct(Integer productId){
        if(productId == null){
            throw new IllegalArgumentException("Tham số truyền vào productId không được null");
        }

        ProductEntity productEntity = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy sản phẩm với ID: " + productId
                ));

        productRepository.delete(productEntity);
    }
}
