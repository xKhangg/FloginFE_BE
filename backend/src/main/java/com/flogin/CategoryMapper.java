package com.flogin;

import com.flogin.dto.CategoryDTO;
import com.flogin.entity.CategoryEntity;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryDTO toDTO(CategoryEntity categoryEntity){
        if(categoryEntity == null){
            return null;
        }

        CategoryDTO categoryDTO = new CategoryDTO();
        categoryDTO.setId(categoryEntity.getId());
        categoryDTO.setName(categoryEntity.getName());

        return categoryDTO;
    }

    public CategoryEntity toEntity(CategoryDTO categoryDTO){
        if(categoryDTO == null){
            return null;
        }

        CategoryEntity categoryEntity = new CategoryEntity();
        categoryEntity.setId(categoryDTO.getId());
        categoryEntity.setName(categoryDTO.getName());

        return categoryEntity;
    }
}
