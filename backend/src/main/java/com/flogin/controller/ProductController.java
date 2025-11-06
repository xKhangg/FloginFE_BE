package com.flogin.controller;

import com.flogin.dto.ProductDTO;
import com.flogin.entity.ProductEntity;
import com.flogin.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000") //Dùng @CrossOrigin thay vì WebConfig cho nhanh vì chỉ có 2 Controller
public class ProductController {

    private final ProductService productService;

    private static final int FIXED_PAGE_SIZE = 10;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /*
    Không cần kiểm tra tham số truyền vào (productDTO) có null không. Lý do là Spring Framework (với @RequestBody và @Valid) đã làm thay bạn rồi.
    Nếu client gửi body rỗng hoặc sai cấu trúc: Annotation @RequestBody (cùng với thư viện Jackson) sẽ cố gắng chuyển đổi JSON body thành ProductRequestDTO.
    Nếu body là rỗng ({}), productRequestDTO sẽ được tạo ra (không null) nhưng các trường bên trong nó sẽ null.
    Nếu body là hoàn toàn không hợp lệ (ví dụ: không phải JSON), Spring sẽ ném ra lỗi HttpMessageNotReadableException trước khi code của bạn trong hàm addProduct được thực thi.
    Nếu client gửi body với các trường bị thiếu: Annotation @Valid sẽ kiểm tra các ràng buộc (@NotNull, @NotBlank) bên trong DTO.
    Nếu categoryId bị thiếu (là null), @Valid sẽ phát hiện và Spring sẽ ném ra lỗi MethodArgumentNotValidException trước khi code của bạn được thực thi.
     */
    /*
    GIỮ các annotation (@NotNull, @NotBlank...) trên các trường (field) của ProductDTO.

    GIỮ các kiểm tra if (var == null) thủ công bên trong các phương thức của ProductService.
     */
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(
            @Valid @RequestBody ProductDTO productDTO
    ){
        ProductDTO newProductDTO = productService.createProduct(productDTO);

        return new ResponseEntity<>(newProductDTO, HttpStatus.CREATED);
    }

    @GetMapping
//    public ResponseEntity<List<ProductDTO>> getAllProducts(
//            @RequestParam(required = false) Integer categoryId
//    ){
//        List<ProductDTO> productDTOList = productService.getAllProducts(categoryId);
//
//        return ResponseEntity.ok(productDTOList);
//    }
    //Phân trang
    public ResponseEntity<Page<ProductDTO>> getAllProducts(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(defaultValue = "0") int page
    ){
        Page<ProductDTO> productsPage = productService.getAllProducts(categoryId, page, FIXED_PAGE_SIZE);

        return ResponseEntity.ok(productsPage);
    }

    /*
    @GetMapping("/{id}"): Bạn đang định nghĩa một Biến đường dẫn (Path Variable). URL mà Spring Boot mong đợi sẽ là: /api/products/123.

    @RequestParam Integer productId: Bạn lại đang cố gắng đọc một Tham số truy vấn (Query Parameter). URL mà annotation này mong đợi là: /api/products?productId=123.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(
            @PathVariable Integer id
    ){
        ProductDTO productDTO = productService.getProduct(id);

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
