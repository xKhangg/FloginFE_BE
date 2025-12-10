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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ProductServiceMockTest {

    @Mock
    private ProductRepository productRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductService productService;

    //Mock Data
    private CategoryEntity mockCategoryEntity;
    private ProductEntity mockProductEntity;
    private ProductDTO mockProductDTO;
    private static final Integer categoryId = 1;
    private static final Integer productId = 1;

    private Page<ProductEntity> mockProductEntityPage;
    private Pageable pageable;

    List<ProductEntity> productList;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        mockCategoryEntity = new CategoryEntity();
        mockCategoryEntity.setId(categoryId);
        mockCategoryEntity.setName("Trinh thám");

        mockProductEntity = new ProductEntity();
        mockProductEntity.setId(productId);
        mockProductEntity.setName("Book1");
        mockProductEntity.setPrice(100_000D);
        mockProductEntity.setQuantity(10);
        mockProductEntity.setDescription("Book1 for testing");
        mockProductEntity.setCategory(mockCategoryEntity);

        mockProductDTO = new ProductDTO();
        mockProductDTO.setId(productId);
        mockProductDTO.setName("Book1");
        mockProductDTO.setPrice(100_000D);
        mockProductDTO.setQuantity(10);
        mockProductDTO.setDescription("Book1 for testing");
        mockProductDTO.setCategoryId(1);

        pageable = PageRequest.of(0, 10);
        productList = List.of(mockProductEntity);
        mockProductEntityPage = new PageImpl<>(productList, pageable, productList.size());
    }

    @Test
    @DisplayName("Lấy 1 sản phẩm theo ID")
    void testGetProductByID(){
        //ARRANGE
        when(productRepository.findById(eq(productId)))
                .thenReturn(Optional.of(mockProductEntity));
        when(productMapper.toDTO(any(ProductEntity.class)))
                .thenReturn(mockProductDTO);

        //ACT
        ProductDTO result = productService.getProductByID(productId);

        //ASSERT
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("Book1", result.getName());
        assertEquals(100_000, result.getPrice());
        assertEquals(10, result.getQuantity());

        //VERIFY
        verify(productRepository, times(1))
                .findById(eq(productId));
        verify(productMapper, times(1))
                .toDTO(any(ProductEntity.class));
    }

    @Test
    @DisplayName("Tạo sản phẩm mới")
    void testCreateProduct() {
        //ARRANGE
        when(categoryRepository.findById(eq(categoryId)))
                .thenReturn(Optional.of(mockCategoryEntity));
        when(productRepository.save(any(ProductEntity.class)))
                .thenReturn(mockProductEntity);

        when(productMapper.toDTO(any(ProductEntity.class)))
                .thenReturn(mockProductDTO);

        //ACT
        ProductDTO result = productService.createProduct(mockProductDTO);

        //ASSERT
        assertNotNull(result);
        assertEquals("Book1", result.getName());
        assertEquals(100_000, result.getPrice());
        assertEquals(10, result.getQuantity());

        //VERIFY
        verify(categoryRepository, times(1)).findById(eq(categoryId));
        verify(productRepository, times(1)).save(any(ProductEntity.class));
        verify(productMapper, times(1))
                .toDTO(any(ProductEntity.class));
    }

    @Test
    @DisplayName("Lấy danh sách tất cả sản phẩm (phân trang)")
    void testGetAllProductsPaginated_AllCategories(){
        //ARRANGE
        when(productRepository.searchProducts(any(), any(), (any(Pageable.class))))
                .thenReturn(mockProductEntityPage);
        when(productMapper.toDTO(any(ProductEntity.class)))
                .thenReturn(mockProductDTO);

        //ACT
        Page<ProductDTO> resultPage = productService.getAllProductsPaginated(
                null,
                null,
                pageable.getPageNumber(),
                pageable.getPageSize());

        //ASSERT
        assertNotNull(resultPage);
        assertEquals(1L, resultPage.getTotalElements());
        assertEquals(1, resultPage.getContent().size());

        //VERIFY
        verify(productRepository, times(1)).searchProducts(any(), any(), any(Pageable.class));
        verify(productMapper, times(1))
                .toDTO(any(ProductEntity.class));
    }

    @Test
    @DisplayName("Cập nhật sản phẩm")
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
        newProductDTO.setCategoryName(newCategoryEntity.getName());

        when(categoryRepository.findById(eq(newCategoryEntity.getId())))
                .thenReturn(Optional.of(newCategoryEntity));
        when(productRepository.findById(eq(productId)))
                .thenReturn(Optional.of(mockProductEntity));

        when(productMapper.toDTO(any(ProductEntity.class)))
                .thenReturn(newProductDTO);

        //ACT
        ProductDTO result = productService.updateProduct(mockProductDTO.getId(), newProductDTO);

        //ASSERT
        assertNotNull(result);
        assertEquals("Book2", result.getName());
        assertEquals(150_000, result.getPrice());
        assertEquals(15, result.getQuantity());

        //VERIFY
        verify(categoryRepository, times(1))
                .findById(eq(newCategoryEntity.getId()));
        verify(productRepository, times(1))
                .findById(eq(productId));

        verify(productMapper, times(1))
                .toDTO(any(ProductEntity.class));

        verify(productRepository, never())
                .save(any(ProductEntity.class));
    }

    @Test
    @DisplayName("Xoá sản phẩm")
    void testDeleteProduct(){
        //ARRANGE
        when(productRepository.findById(eq(productId)))
                .thenReturn(Optional.of(mockProductEntity));

        doNothing().when(productRepository).delete(any(ProductEntity.class));

        //ASSERT
        assertDoesNotThrow(() -> productService.deleteProduct(productId));

        //VERIFY
        verify(productRepository, times(1)).delete(any(ProductEntity.class));
    }
}
