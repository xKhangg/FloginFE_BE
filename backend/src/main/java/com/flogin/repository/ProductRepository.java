package com.flogin.repository;

import com.flogin.entity.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

//Không cần viết gì
//Các câu truy vấn Database đã được JpaRepository cung cấp
public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {
    /*
    Vấn đề hiệu năng: Lỗi N+1 Query (getAllProducts)
    Vấn đề: Trong getAllProducts, bạn gọi productRepository.findAll() (hoặc findAllByCategoryId). Các hàm này chỉ lấy ProductEntity (vì Category là LAZY). Khi bạn gọi productMapper::toDTO, hàm mapper sẽ truy cập entity.getCategory().getId().

    Hậu quả: Nếu bạn có 100 sản phẩm, code này sẽ chạy 101 câu query (1 câu để lấy 100 sản phẩm, và 100 câu query con để lấy Category cho từng sản phẩm).

    /**
     * Tìm kiếm sản phẩm đa năng:
     * 1. JOIN FETCH: Để lấy luôn Category (tránh lỗi N+1).
     * 2. WHERE: Kiểm tra điều kiện linh hoạt.
     * - Nếu categoryId là NULL -> Bỏ qua điều kiện này (Lấy tất cả loại).
     * - Nếu keyword là NULL -> Bỏ qua điều kiện này (Lấy tất cả tên).
     */
    @Query(value = "SELECT p FROM ProductEntity p JOIN FETCH p.category c " +
            "WHERE (:categoryId IS NULL OR c.id = :categoryId) " +
            "AND (:keyword IS NULL OR p.name LIKE %:keyword%)",
            countQuery = "SELECT COUNT(p) FROM ProductEntity p " +
                    "WHERE (:categoryId IS NULL OR p.category.id = :categoryId) " +
                    "AND (:keyword IS NULL OR p.name LIKE %:keyword%)")
    Page<ProductEntity> searchProducts(@Param("keyword") String keyword,
                                       @Param("categoryId") Integer categoryId,
                                       Pageable pageable);
}
