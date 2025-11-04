package com.flogin;

import com.flogin.dto.ProductDTO;
import com.flogin.entity.CategoryEntity;
import com.flogin.entity.ProductEntity;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductDTO toDTO(ProductEntity productEntity){
        if(productEntity == null){
            return null;
        }

        return new ProductDTO(
                productEntity.getName(),
                productEntity.getPrice(),
                productEntity.getQuantity(),
                productEntity.getDescription(),
                productEntity.getCategory().getId()
        );
    }

    public ProductEntity toEntity(ProductDTO productDTO, CategoryEntity categoryEntity){
        if(productDTO == null){
            return null;
        }

        return new ProductEntity(
                productDTO.getName(),
                productDTO.getPrice(),
                productDTO.getQuantity(),
                productDTO.getDescription(),
                categoryEntity
        );
    }
}
