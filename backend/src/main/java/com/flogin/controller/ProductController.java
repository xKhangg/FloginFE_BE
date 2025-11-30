package com.flogin.controller;

import com.flogin.dto.ProductDTO;
import com.flogin.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    private static final int FIXED_PAGE_SIZE = 10;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(
            @Valid @RequestBody ProductDTO productDTO
    ){
        ProductDTO newProductDTO = productService.createProduct(productDTO);

        return new ResponseEntity<>(newProductDTO, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getAllProductsPaginated(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(defaultValue = "0") int page
    ){
        Page<ProductDTO> productsPage = productService.getAllProductsPaginated(name, categoryId, page, FIXED_PAGE_SIZE);

        return ResponseEntity.ok(productsPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(
            @PathVariable Integer id
    ){
        ProductDTO productDTO = productService.getProductByID(id);

        return ResponseEntity.ok(productDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Integer id,
            @Valid @RequestBody ProductDTO productDTO
    ){
        ProductDTO updatedProductDTO = productService.updateProduct(id, productDTO);

        return ResponseEntity.ok(updatedProductDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Integer id
    ){
        productService.deleteProduct(id);

        return ResponseEntity.noContent().build();
    }
}
