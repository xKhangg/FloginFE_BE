import com.flogin.dto.ProductDTO;
import com.flogin.entity.CategoryEntity;
import com.flogin.entity.ProductEntity;
import com.flogin.repository.ProductRepository;
import com.flogin.service.ProductService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

public class ProductServiceMockTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    @DisplayName("Lấy 1 sản phẩm theo ID")
    void testGetProductById() {
        //ARRANGE
        CategoryEntity categoryEntity = new CategoryEntity(1, "Trinh thám");

        ProductEntity mockProductEntity = new ProductEntity(
                1, "Book1", 100_000D, 10, "Book1 for testing", categoryEntity
        );

        when(productRepository.findById(1))
                .thenReturn(Optional.of(mockProductEntity));

        //ACT
        ProductDTO result = productService.getProductByID(1);

        //ASSERT
        assertNotNull(result);
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("Book1", result.getName());
        assertEquals(100_000, result.getPrice());
        assertEquals(10, result.getQuantity());
        assertEquals("Book1 for testing", result.getDescription());
        assertEquals(1, result.getCategoryId());

        //VERIFY
        verify(productRepository, times(1)).findById(1);
    }
}
