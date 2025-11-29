import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.FloginApplication;
import com.flogin.controller.ProductController;
import com.flogin.dto.ProductDTO;
import com.flogin.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ContextConfiguration(classes = FloginApplication.class)
@WebMvcTest(ProductController.class)
@WithMockUser(username = "admin", roles = {"USER", "ADMIN"})
@DisplayName("Product API Integration Test")
public class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ProductService productService;

    //Mock Data
    private ProductDTO requestProductDTO;
    private ProductDTO responseProductDTO;
    private static final Integer productId = 1;

    @BeforeEach
    void setUp() {
        requestProductDTO = new ProductDTO();
        requestProductDTO.setId(productId);
        requestProductDTO.setName("Book1");
        requestProductDTO.setPrice(100_000D);
        requestProductDTO.setQuantity(10);
        requestProductDTO.setCategoryId(1);
        requestProductDTO.setDescription("Book1 for testing");

        responseProductDTO = new ProductDTO();
        responseProductDTO.setId(productId);
        responseProductDTO.setName("Book1");
        responseProductDTO.setPrice(100_000D);
        responseProductDTO.setQuantity(10);
        responseProductDTO.setCategoryId(1);
        responseProductDTO.setCategoryName("Trinh thám");
        responseProductDTO.setDescription("Book1 for testing");
    }

    @Test
    @DisplayName("GET /api/products - Lấy danh sách sản phẩm")
    void testGetAllProductsPaginated() throws Exception{
        //ARRANGE
        List<ProductDTO> productDTOList = Arrays.asList(
                new ProductDTO("Book1", 100_000D, 10, "Book1 for testing", 1),
                new ProductDTO("Book2", 150_000D, 15, "Book2 for testing", 2)
        );

        Page<ProductDTO> productPage = new PageImpl<>(productDTOList);

        when(productService.getAllProductsPaginated(any(), any(), anyInt(), anyInt()))
                .thenReturn(productPage);

        //VERIFY
        mockMvc.perform(get("/api/products")
                        .param("page", "0")
                        .param("size", "10")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.content[0].name").value("Book1"))
                .andExpect(jsonPath("$.content[0].price").value(100_000D))
                .andExpect(jsonPath("$.content[0].quantity").value(10))
                .andExpect(jsonPath("$.content[0].categoryId").value(1))
                .andExpect(jsonPath("$.content[0].description").value("Book1 for testing"));
    }

    @Test
    @DisplayName("GET /api/products/{id} - Lấy 1 sản phẩm")
    void testGetProductById() throws Exception{
        //ARRANGE
        when(productService.getProductByID(eq(productId)))
                .thenReturn(responseProductDTO);

        //ACT & VERIFY
        mockMvc.perform(get("/api/products/" + productId)
                        .with(csrf()))
                .andExpect(status().isOk())

                .andExpect(jsonPath("$.id").value(productId))
                .andExpect(jsonPath("$.name").value("Book1"))
                .andExpect(jsonPath("$.price").value(100_000D))
                .andExpect(jsonPath("$.quantity").value(10))
                .andExpect(jsonPath("$.categoryId").value(1))
                .andExpect(jsonPath("$.categoryName").value("Trinh thám"))
                .andExpect(jsonPath("$.description").value("Book1 for testing"));
    }

    @Test
    @DisplayName("POST /api/products - Tạo sản phẩm mới")
    void testCreateProduct() throws Exception{
        //ARRANGE
        when(productService.createProduct(any(ProductDTO.class)))
                .thenReturn(responseProductDTO);

        // ----- ACT & VERIFY -----
        mockMvc.perform(post("/api/products")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON) // 2. Nói rằng tôi đang gửi JSON
                        .content(objectMapper.writeValueAsString(requestProductDTO))) // 3. Gửi body (chuyển DTO thành chuỗi JSON)

                // 4. Mong đợi status 201 CREATED (không phải 200 OK)
                .andExpect(status().isCreated())

                .andExpect(jsonPath("$.id").value(productId))
                .andExpect(jsonPath("$.name").value("Book1"))
                .andExpect(jsonPath("$.price").value(100_000D))
                .andExpect(jsonPath("$.quantity").value(10))
                .andExpect(jsonPath("$.categoryId").value(1))
                .andExpect(jsonPath("$.categoryName").value("Trinh thám"))
                .andExpect(jsonPath("$.description").value("Book1 for testing"));

        verify(productService, times(1)).createProduct(any(ProductDTO.class));
    }

    @Test
    @DisplayName("PUT /api/products/{id} - Cập nhật sản phẩm")
    void testUpdateProduct() throws Exception{
        //ARRANGE
        responseProductDTO = new ProductDTO();
        responseProductDTO.setId(2);
        responseProductDTO.setName("Book2");
        responseProductDTO.setPrice(150_000D);
        responseProductDTO.setQuantity(15);
        responseProductDTO.setDescription("Book2 for testing");
        responseProductDTO.setCategoryId(2);

        when(productService.updateProduct(eq(productId), any(ProductDTO.class)))
                .thenReturn(responseProductDTO);

        // ----- ACT & VERIFY -----
        mockMvc.perform(put("/api/products/" + productId)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestProductDTO)))

                .andExpect(status().isOk())

                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.name").value("Book2"))
                .andExpect(jsonPath("$.price").value(150_000D))
                .andExpect(jsonPath("$.quantity").value(15))
                .andExpect(jsonPath("$.categoryId").value(2))
                .andExpect(jsonPath("$.description").value("Book2 for testing"));

        verify(productService, times(1)).updateProduct(eq(productId), any(ProductDTO.class));
    }

    @Test
    @DisplayName("DELETE /api/products/{id} - Xoá 1 sản phẩm")
    void testDeleteProduct() throws Exception{
        //ARRANGE
        doNothing().when(productService).deleteProduct(eq(productId));

        //ACT & VERIFY
        mockMvc.perform(delete("/api/products/" + productId)
                        .with(csrf()))
                // 4. Mong đợi status 204 NO CONTENT
                .andExpect(status().isNoContent());

        verify(productService, times(1)).deleteProduct(eq(productId));
    }
}
