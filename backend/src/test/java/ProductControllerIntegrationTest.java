import com.flogin.controller.ProductController;
import com.flogin.dto.ProductDTO;
import com.flogin.service.ProductService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@WebMvcTest(ProductController.class)
@DisplayName("Product API Integration Test")
public class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProductService productService;

    @Test
    @DisplayName("GET /api/products - Lấy danh sách sản phẩm")
    void testGetAllProducts() throws Exception{
        //ARRANGE
        List<ProductDTO> productDTOList = Arrays.asList(
                new ProductDTO("Book1", 100_000D, 10, "Book1 for testing", 1),
                new ProductDTO("Book2", 150_000D, 15, "Book2 for testing", 2)
        );

        when(productService.getAllProducts(anyInt()))
                .thenReturn(productDTOList);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name").value("Book1"));
    }

}
