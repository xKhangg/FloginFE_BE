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

        ProductDTO productDTO = new ProductDTO();
        productDTO.setId(productEntity.getId());
        productDTO.setName(productEntity.getName());
        productDTO.setPrice(productEntity.getPrice());
        productDTO.setQuantity(productEntity.getQuantity());
        productDTO.setDescription(productEntity.getDescription());

        CategoryEntity categoryEntity = productEntity.getCategory();
        if(categoryEntity != null){
            productDTO.setCategoryId(categoryEntity.getId());
            productDTO.setCategoryName(categoryEntity.getName());
        }
        return productDTO;
    }

    public ProductEntity toEntity(ProductDTO productDTO, CategoryEntity categoryEntity){
        if(productDTO == null){
            return null;
        }

        ProductEntity productEntity = new ProductEntity();
        productEntity.setId(productDTO.getId());
        productEntity.setName(productDTO.getName());
        productEntity.setPrice(productDTO.getPrice());
        productEntity.setQuantity(productDTO.getQuantity());
        productEntity.setDescription(productDTO.getDescription());
        productEntity.setCategory(categoryEntity);

        return productEntity;
    }
}
