package com.flogin.repository;

import com.flogin.entity.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {
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
