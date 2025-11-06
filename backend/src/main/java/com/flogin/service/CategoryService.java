package com.flogin.service;

import com.flogin.CategoryMapper;
import com.flogin.dto.CategoryDTO;
import com.flogin.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    public List<CategoryDTO> getAllCategories(){
        return categoryRepository.findAll().stream().map(categoryMapper::toDTO).toList();
    }
}
