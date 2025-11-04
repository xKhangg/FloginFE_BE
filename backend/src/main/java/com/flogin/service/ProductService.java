package com.flogin.service;

import com.flogin.dto.ProductDTO;
import com.flogin.entity.CategoryEntity;
import com.flogin.entity.ProductEntity;
import com.flogin.repository.CategoryRepository;
import com.flogin.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public ProductService(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    //Đảm bảo toàn vẹn dữ liệu (Thành công hết, nếu sai 1 bước thì rollback)
    @Transactional
    public ProductEntity createProduct(ProductDTO productDTO){
        //Tìm không thấy => ném Exception
        CategoryEntity categoryEntity = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy Category với ID: " + productDTO.getCategoryId()
                ));

        ProductEntity productEntity = new ProductEntity(
                productDTO.getName(),
                productDTO.getPrice(),
                productDTO.getQuantity(),
                productDTO.getDescription(),
                categoryEntity
        );

        return productRepository.save(productEntity);
    }
}
