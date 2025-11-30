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

    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO){

        if(productDTO == null){
            throw new IllegalArgumentException("Tham số truyền vào productDTO không được null");
        }

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

    public Page<ProductDTO> getAllProductsPaginated(String name, Integer categoryId, int page, int pageSize){

        // 1. Tạo đối tượng Pageable (chỉ định trang nào, bao nhiêu phần tử)
        Pageable pageable = PageRequest.of(page, pageSize);

        Page<ProductEntity> productEntityPage;

        //2. Gọi hàm Repository tương ứng
        productEntityPage = productRepository.searchProducts(name, categoryId, pageable);

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
