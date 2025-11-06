import com.flogin.dto.ProductDTO;
import com.flogin.entity.ProductEntity;
import com.flogin.repository.ProductRepository;
import com.flogin.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@DisplayName(" Product Service Unit Tests ")
public class ProductServiceTest {
    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Test Case 1: Tạo sản phẩm mới thành công")
    void testCreateProduct() {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setName("Book1");
        productDTO.setPrice(150_000);
        productDTO.setQuantity(10);
        productDTO.setDescription("Book for testing");

        ProductEntity productEntity = new ProductEntity();
        productEntity.setId(1);
        productEntity.setName("Book1");
        productEntity.setPrice(150_000);
        productEntity.setQuantity(10);
        productEntity.setDescription("Book for testing");

        when(productRepository.save(any(ProductEntity.class)))
                .thenReturn(productEntity);

        ProductDTO result = productService.createProduct(productDTO);

        assertNotNull(result);
        assertEquals(" Laptop ", result.getName());
        verify(productRepository, times(1)).save(any(ProductEntity.class));
    }
}