import com.flogin.ProductMapper;
import com.flogin.dto.ProductDTO;
import com.flogin.entity.CategoryEntity;
import com.flogin.entity.ProductEntity;
import com.flogin.repository.CategoryRepository;
import com.flogin.repository.ProductRepository;
import com.flogin.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@DisplayName(" Product Service Unit Tests ")
public class ProductServiceTest {
    @Mock
    private ProductRepository productRepository;
    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductService productService;

    //Mock Data
    private CategoryEntity categoryEntity;
    private ProductEntity productEntity;
    private ProductDTO productDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        categoryEntity = new CategoryEntity();
        categoryEntity.setId(1);
        categoryEntity.setName("Trinh thám");

        productEntity = new ProductEntity();
        productEntity.setId(1);
        productEntity.setName("Book1");
        productEntity.setPrice(150_000);
        productEntity.setQuantity(10);
        productEntity.setDescription("Book1 for testing");
        productEntity.setCategory(categoryEntity);

        productDTO = new ProductDTO();
        productDTO.setName("Book1");
        productDTO.setPrice(100_000);
        productDTO.setQuantity(10);
        productDTO.setDescription("Book1 for testing");
        productDTO.setCategoryId(1);
    }

    @Test
    @DisplayName("Test Case 1: Tạo sản phẩm mới thành công")
    void testCreateProduct() {

        when(productRepository.save(any(ProductEntity.class)))
                .thenReturn(productEntity);

        ProductDTO result = productService.createProduct(productDTO);

        assertNotNull(result);
        assertEquals("Book1", result.getName());
        verify(productRepository, times(1)).save(any(ProductEntity.class));
    }

    @Test
    @DisplayName("Test Case 2: Cập nhật sản phẩm thành công")
    void testUpdateProduct() {

        CategoryEntity newCategoryEntity = new CategoryEntity();
        newCategoryEntity.setId(1);
        newCategoryEntity.setName("Trinh thám");

        productEntity = new ProductEntity();
        productEntity.setId(2);
        productEntity.setName("Book2");
        productEntity.setPrice(150_000);
        productEntity.setQuantity(15);
        productEntity.setDescription("Book2 for testing");
        productEntity.setCategory(newCategoryEntity);

        /*
        1. 📦 "Hộp" Optional là gì?
        Từ Java 8, các lập trình viên được khuyến khích không trả về null (vì dễ gây NullPointerException). Thay vào đó, họ dùng Optional.
        Optional là một "cái hộp":
        Hộp có chứa đồ (value): Nếu tìm thấy, nó trả về một Optional chứa giá trị đó.
        Hộp rỗng (empty): Nếu không tìm thấy, nó trả về một Optional.empty() (hộp rỗng).
        2. 📖 Tại sao bạn bắt buộc phải dùng nó trong Test?
        Vấn đề nằm ở chữ ký (signature) của hàm findById trong JpaRepository:
        Hàm productRepository.findById(id) không trả về ProductEntity.
        Nó trả về Optional<ProductEntity> (một cái hộp có thể chứa ProductEntity).
         */
        when(categoryRepository.findById(anyInt()))
                .thenReturn(Optional.of(categoryEntity));
        when(productRepository.findById(anyInt()))
                .thenReturn(Optional.of(productEntity));

        when(productMapper.toDTO(any(ProductEntity.class)))
                .thenReturn(productDTO);

        ProductDTO result = productService.updateProduct(productDTO.getId(), productDTO);

        assertNotNull(result);
        assertEquals(2, result.getId());
        assertEquals("Book2", result.getName());
        assertEquals(150_000, result.getPrice());
        assertEquals(15, result.getQuantity());
        assertEquals("Book2 for testing", result.getDescription());
        assertEquals(categoryEntity, productEntity.getCategory());

        verify(categoryRepository, times(1))
                .findById(anyInt());
        verify(productRepository, times(1))
                .findById(anyInt());

        verify(productMapper, times(1))
                .toDTO(any(ProductEntity.class));

        verify(productRepository, never())
                .save(any(ProductEntity.class));
    }
}