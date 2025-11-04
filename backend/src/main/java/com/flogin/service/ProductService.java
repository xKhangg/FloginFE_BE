package com.flogin.service;

import com.flogin.dto.ProductDTO;
import com.flogin.entity.CategoryEntity;
import com.flogin.entity.ProductEntity;
import com.flogin.repository.CategoryRepository;
import com.flogin.repository.ProductRepository;
import com.flogin.ProductMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
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
    public ProductEntity createProduct(ProductDTO productDTO){

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

        return productRepository.save(productEntity);
    }

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

    public ProductDTO getProduct(Integer productId){
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
