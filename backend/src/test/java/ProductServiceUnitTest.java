import com.flogin.ProductMapper;
import com.flogin.dto.ProductDTO;
import com.flogin.entity.CategoryEntity;
import com.flogin.entity.ProductEntity;
import com.flogin.repository.CategoryRepository;
import com.flogin.repository.ProductRepository;
import com.flogin.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("Product Service Unit Tests")
public class ProductServiceUnitTest {
    @Mock
    private ProductRepository productRepository;
    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductService productService;

    //Test Data
    private CategoryEntity categoryEntity;
    private ProductEntity productEntity;
    private ProductDTO productDTO;
    private static final Integer categoryId = 1;
    private static final Integer productId = 1;

    private Page<ProductEntity> productEntityPage;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        categoryEntity = new CategoryEntity();
        categoryEntity.setId(categoryId);
        categoryEntity.setName("Trinh thám");

        productEntity = new ProductEntity();
        productEntity.setId(productId);
        productEntity.setName("Book1");
        productEntity.setPrice(100_000D);
        productEntity.setQuantity(10);
        productEntity.setDescription("Book1 for testing");
        productEntity.setCategory(categoryEntity);

        productDTO = new ProductDTO();
        productDTO.setId(productId);
        productDTO.setName("Book1");
        productDTO.setPrice(100_000D);
        productDTO.setQuantity(10);
        productDTO.setDescription("Book1 for testing");
        productDTO.setCategoryId(categoryId);

        pageable = PageRequest.of(0, 10);
        List<ProductEntity> productList = List.of(productEntity);
        productEntityPage = new PageImpl<>(productList, pageable, productList.size());
    }

    @Test
    @DisplayName("Test Case 1: Tạo sản phẩm mới thành công")
    void testCreateProduct() {
        //ARRANGE
        when(categoryRepository.findById(eq(categoryId)))
                .thenReturn(Optional.of(categoryEntity));
        when(productRepository.save(any(ProductEntity.class)))
                .thenReturn(productEntity);

        when(productMapper.toDTO(any(ProductEntity.class)))
                .thenReturn(productDTO);

        //ACT
        ProductDTO result = productService.createProduct(productDTO);

        //ASSERT
        assertNotNull(result);
        assertEquals("Book1", result.getName());
        assertEquals(100_000, result.getPrice());
        assertEquals(10, result.getQuantity());

        //VERIFY
        verify(productRepository, times(1)).save(any(ProductEntity.class));
    }

    @Test
    @DisplayName("Test Case 2: Cập nhật sản phẩm thành công")
    void testUpdateProduct() {

        //ARRANGE
        CategoryEntity newCategoryEntity = new CategoryEntity();
        newCategoryEntity.setId(2);
        newCategoryEntity.setName("Khoa học");

        ProductDTO newProductDTO = new ProductDTO();
        newProductDTO.setId(productId);
        newProductDTO.setName("Book2");
        newProductDTO.setPrice(150_000D);
        newProductDTO.setQuantity(15);
        newProductDTO.setDescription("Book2 for testing");
        newProductDTO.setCategoryId(newCategoryEntity.getId());

        when(categoryRepository.findById(eq(newCategoryEntity.getId())))
                .thenReturn(Optional.of(newCategoryEntity));
        when(productRepository.findById(eq(productId)))
                .thenReturn(Optional.of(productEntity));

        when(productMapper.toDTO(any(ProductEntity.class)))
                .thenReturn(newProductDTO);

        //ACT
        ProductDTO result = productService.updateProduct(productDTO.getId(), newProductDTO);

        //ASSERT
        assertNotNull(result);
        assertEquals("Book2", result.getName());
        assertEquals(150_000, result.getPrice());
        assertEquals(15, result.getQuantity());

        //VERIFY
        verify(productRepository, times(1))
                .findById(eq(productId));
    }

    @Test
    @DisplayName("Test Case 3: Lấy danh sách tất cả sản phẩm (phân trang) thành công")
    void testGetAllProductsPaginated_AllCategories(){
        //ARRANGE
        when(productRepository.searchProducts(any(), any(), any(Pageable.class)))
                .thenReturn(productEntityPage);
        when(productMapper.toDTO(any(ProductEntity.class)))
                .thenReturn(productDTO);

        //ACT
        Page<ProductDTO> resultPage = productService.getAllProductsPaginated(
                null,
                null,
                pageable.getPageNumber(),
                pageable.getPageSize());

        //ASSERT
        assertNotNull(resultPage);
        assertEquals(1L, resultPage.getTotalElements());

        //VERIFY
        verify(productRepository, times(1)).searchProducts(any(), any(), any(Pageable.class));
    }

    @Test
    @DisplayName("Test Case 4: Lấy 1 sản phẩm (Xem chi tiết) thành công")
    void testGetProductByID(){
        //ARRANGE
        when(productRepository.findById(eq(productId)))
                .thenReturn(Optional.of(productEntity));
        when(productMapper.toDTO(any(ProductEntity.class)))
                .thenReturn(productDTO);

        //ACT
        ProductDTO result = productService.getProductByID(productId);

        //ASSERT
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("Book1", result.getName());
        assertEquals(100_000, result.getPrice());
        assertEquals(10, result.getQuantity());

        //VERIFY
        verify(productRepository, times(1)).findById(eq(productId));
    }

    @Test
    @DisplayName("Test Case 5: Xoá sản phẩm thành công")
    void testDeleteProduct(){
        //ARRANGE
        when(productRepository.findById(eq(productId)))
                .thenReturn(Optional.of(productEntity));

        doNothing().when(productRepository).delete(any(ProductEntity.class));

        //ASSERT
        assertDoesNotThrow(() -> productService.deleteProduct(productId));

        //VERIFY
        verify(productRepository, times(1)).delete(any(ProductEntity.class));
    }

    @Test
    @DisplayName("Xóa sản phẩm thất bại: ID không tồn tại")
    void testDeleteProduct_NotFound() {
        // ARRANGE
        when(productRepository.findById(eq(999)))
                .thenReturn(Optional.empty());

        // ACT & ASSERT
        assertThrows(EntityNotFoundException.class, () -> {
            productService.deleteProduct(999);
        });

        // VERIFY
        verify(productRepository, times(1)).findById(eq(999));
        verify(productRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Xóa sản phẩm thất bại: Input là Null")
    void testDeleteProduct_NullId() {
        // ACT & ASSERT
        assertThrows(IllegalArgumentException.class, () -> {
            productService.deleteProduct(null);
        });

        // VERIFY
        verifyNoInteractions(productRepository);
    }

    @Test
    @DisplayName("Tạo sản phẩm thất bại: Category không tồn tại")
    void testCreateProduct_CategoryNotFound() {
        // ARRANGE
        when(categoryRepository.findById(anyInt()))
                .thenReturn(Optional.empty());

        // ACT & ASSERT
        assertThrows(EntityNotFoundException.class, () -> {
            productService.createProduct(productDTO);
        });

        // VERIFY
        verify(productRepository, never()).save(any());
    }

    @Test
    @DisplayName("Lấy sản phẩm thất bại: ID không tồn tại")
    void testGetProduct_NotFound() {
        // ARRANGE
        when(productRepository.findById(eq(999)))
                .thenReturn(Optional.empty());

        // ACT & ASSERT
        assertThrows(EntityNotFoundException.class, () -> {
            productService.getProductByID(999);
        });

        // VERIFY
        verify(productRepository, times(1)).findById(eq(999));
    }

    @Test
    @DisplayName("Cập nhật thất bại: Product ID là null")
    void testUpdateProduct_NullId() {
        // ACT & ASSERT
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            productService.updateProduct(null, productDTO);
        });

        assertEquals("Tham số truyền vào productId không được null", exception.getMessage());

        // VERIFY
        verifyNoInteractions(productRepository);
    }

    @Test
    @DisplayName("Cập nhật thất bại: ProductDTO là null")
    void testUpdateProduct_NullDTO() {
        // ACT & ASSERT
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            productService.updateProduct(productId, null);
        });

        assertEquals("Tham số truyền vào productDTO không được null", exception.getMessage());

        // VERIFY
        verifyNoInteractions(productRepository);
    }
}