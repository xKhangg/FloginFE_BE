package com.flogin.repository;

import com.flogin.entity.UserEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;
//Không cần viết gì
//Các câu truy vấn Database đã được JpaRepository cung cấp
public interface UserRepository extends CrudRepository<UserEntity, Long> {

    Optional<UserEntity> findByUsername(String username);

}
