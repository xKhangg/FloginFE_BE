package com.flogin.controller;

import com.flogin.dto.ProductDTO;
import com.flogin.entity.ProductEntity;
import com.flogin.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @RequestMapping("/api/products")
    @PostMapping
    public ResponseEntity<ProductEntity> createProduct(
            @Valid @RequestBody ProductDTO productDTO
    ){
        ProductEntity newProductEnity = productService.createProduct(productDTO);

        return new ResponseEntity<>(newProductEnity, HttpStatus.CREATED);
    }
}
