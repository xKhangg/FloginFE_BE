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
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /*
    Khng cần kiểm tra tham số truyền vào (productDTO) có null không. Lý do là Spring Framework (với @RequestBody và @Valid) đã làm thay bạn rồi.
    Nếu client gửi body rỗng hoặc sai cấu trúc: Annotation @RequestBody (cùng với thư viện Jackson) sẽ cố gắng chuyển đổi JSON body thành ProductRequestDTO.
    Nếu body là rỗng ({}), productRequestDTO sẽ được tạo ra (không null) nhưng các trường bên trong nó sẽ null.
    Nếu body là hoàn toàn không hợp lệ (ví dụ: không phải JSON), Spring sẽ ném ra lỗi HttpMessageNotReadableException trước khi code của bạn trong hàm addProduct được thực thi.
    Nếu client gửi body với các trường bị thiếu: Annotation @Valid sẽ kiểm tra các ràng buộc (@NotNull, @NotBlank) bên trong DTO.
    Nếu categoryId bị thiếu (là null), @Valid sẽ phát hiện và Spring sẽ ném ra lỗi MethodArgumentNotValidException trước khi code của bạn được thực thi.
     */
    @PostMapping
    public ResponseEntity<ProductEntity> createProduct(
            @Valid @RequestBody ProductDTO productDTO
    ){
        ProductEntity newProductEnity = productService.createProduct(productDTO);

        return new ResponseEntity<>(newProductEnity, HttpStatus.CREATED);
    }
}
