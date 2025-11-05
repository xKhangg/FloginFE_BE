package com.flogin.repository;

import com.flogin.entity.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

//Không cần viết gì
//Các câu truy vấn Database đã được JpaRepository cung cấp
public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {
    /*
    Vấn đề hiệu năng: Lỗi N+1 Query (getAllProducts)
    Vấn đề: Trong getAllProducts, bạn gọi productRepository.findAll() (hoặc findAllByCategoryId). Các hàm này chỉ lấy ProductEntity (vì Category là LAZY). Khi bạn gọi productMapper::toDTO, hàm mapper sẽ truy cập entity.getCategory().getId().

    Hậu quả: Nếu bạn có 100 sản phẩm, code này sẽ chạy 101 câu query (1 câu để lấy 100 sản phẩm, và 100 câu query con để lấy Category cho từng sản phẩm).

    Sửa lại: Bạn phải dùng JOIN FETCH trong Repository như chúng ta đã từng thảo luận.
    */
    // Sửa 1: Thêm hàm này
    @Query("SELECT p FROM ProductEntity p JOIN FETCH p.category")
    List<ProductEntity> findAllWithCategory();

    // Sửa 2: Thêm hàm này
    @Query("SELECT p FROM ProductEntity p JOIN FETCH p.category c WHERE c.id = :categoryId")
    List<ProductEntity> findAllByCategoryId(Integer categoryId);

    // --- HÀM MỚI CHO PHÂN TRANG ---

    /**
     * Lấy tất cả sản phẩm (kèm category) CÓ PHÂN TRANG.
     * Cần countQuery riêng vì JOIN FETCH làm sai logic COUNT mặc định.
     */
    @Query(value = "SELECT p FROM ProductEntity p JOIN FETCH p.category",
            countQuery = "SELECT COUNT(p) FROM ProductEntity p")
    Page<ProductEntity> findAllWithCategoryPaginated(Pageable pageable);

    /**
     * Lấy sản phẩm theo categoryId (kèm category) CÓ PHÂN TRANG.
     */
    @Query(value = "SELECT p FROM ProductEntity p JOIN FETCH p.category c WHERE c.id = :categoryId",
            countQuery = "SELECT COUNT(p) FROM ProductEntity p WHERE p.category.id = :categoryId")
    Page<ProductEntity> findAllByCategoryIdWithCategoryPaginated(Integer categoryId, Pageable pageable);
}
