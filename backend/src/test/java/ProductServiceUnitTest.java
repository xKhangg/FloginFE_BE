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

        // --- Setup cho Phân trang ---

        // 1. Tạo một đối tượng Pageable (trang 0, 10 sản phẩm)
        pageable = PageRequest.of(0, 10);

        // 2. Tạo một danh sách Entity giả (nội dung của trang)
        List<ProductEntity> productList = List.of(productEntity); // Bạn có thể thêm nhiều product vào đây

        // 3. Tạo một đối tượng Page<ProductEntity> giả
        // (Nó cần danh sách, đối tượng Pageable, và tổng số phần tử)
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
        assertEquals(1, result.getId());
        assertEquals("Book1", result.getName());
        assertEquals(100_000, result.getPrice());
        assertEquals(10, result.getQuantity());
        assertEquals("Book1 for testing", result.getDescription());
        assertEquals(1, result.getCategoryId());

        //VERIFY
        verify(categoryRepository, times(1)).findById(eq(categoryId));
        verify(productRepository, times(1)).save(any(ProductEntity.class));
        verify(productMapper, times(1))
                .toDTO(any(ProductEntity.class));
    }

    @Test
    @DisplayName("Test Case 2: Cập nhật sản phẩm thành công")
    void testUpdateProduct() {

        //ARRANGE
        CategoryEntity newCategoryEntity = new CategoryEntity();
        newCategoryEntity.setId(2);
        newCategoryEntity.setName("Khoa học");

        ProductDTO newProductDTO = new ProductDTO();
        newProductDTO.setId(2);
        newProductDTO.setName("Book2");
        newProductDTO.setPrice(150_000D);
        newProductDTO.setQuantity(15);
        newProductDTO.setDescription("Book2 for testing");
        newProductDTO.setCategoryId(newCategoryEntity.getId());
        newProductDTO.setCategoryName(newCategoryEntity.getName());

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
        assertEquals(2, result.getId());
        assertEquals("Book2", result.getName());
        assertEquals(150_000, result.getPrice());
        assertEquals(15, result.getQuantity());
        assertEquals("Book2 for testing", result.getDescription());
        assertEquals(2, result.getCategoryId());
        assertEquals("Khoa học", result.getCategoryName());

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

//    @Test
//    @DisplayName("Test Case 3: Lấy danh sách sản phẩm của 1 Category (phân trang) thành công")
//    void testGetAllProductsPaginated_OneCategory(){
//        //ARRANGE
//        when(productRepository.findAllByCategoryIdWithCategoryPaginated(eq(categoryId), any(Pageable.class)))
//                .thenReturn(productEntityPage);
//        when(productMapper.toDTO(any(ProductEntity.class)))
//                .thenReturn(productDTO);
//
//        //ACT
//        Page<ProductDTO> resultPage = productService.getAllProducts(categoryId, 0, 10);
//
//        //ASSERT
//        assertNotNull(resultPage);
//        assertEquals(1L, resultPage.getTotalElements());
//        assertEquals(1, resultPage.getContent().size());
//
//        //VERIFY
//        verify(productRepository, times(1)).findAllByCategoryIdWithCategoryPaginated(eq(categoryId), any(Pageable.class));
//        verify(productRepository, never()).findAllWithCategoryPaginated(any(Pageable.class));
//    }

    @Test
    @DisplayName("Test Case 3: Lấy danh sách tất cả sản phẩm (phân trang) thành công")
    void testGetAllProductsPaginated_AllCategories(){
        //ARRANGE
        when(productRepository.findAllWithCategoryPaginated((any(Pageable.class))))
                .thenReturn(productEntityPage);
        when(productMapper.toDTO(any(ProductEntity.class)))
                .thenReturn(productDTO);

        //ACT
        Page<ProductDTO> resultPage = productService.getAllProductsPaginated(
                null,
                pageable.getPageNumber(),
                pageable.getPageSize());

        //ASSERT
        assertNotNull(resultPage);
        assertEquals(1L, resultPage.getTotalElements());
        assertEquals(1, resultPage.getContent().size());

        //VERIFY
        verify(productRepository, times(1)).findAllWithCategoryPaginated(any(Pageable.class));
        verify(productRepository, never()).findAllByCategoryIdWithCategoryPaginated(anyInt(), any(Pageable.class));
        verify(productMapper, times(1))
                .toDTO(any(ProductEntity.class));
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
        assertEquals("Book1 for testing", result.getDescription());
        assertEquals(categoryId, result.getCategoryId());

        //VERIFY
        verify(productRepository, times(1)).findById(eq(productId));
        verify(productMapper, times(1))
                .toDTO(any(ProductEntity.class));
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
}