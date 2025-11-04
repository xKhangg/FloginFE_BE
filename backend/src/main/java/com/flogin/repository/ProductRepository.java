package com.flogin.repository;

import com.flogin.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

//Không cần viết gì
//Các câu truy vấn Database đã được JpaRepository cung cấp
public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {
}
