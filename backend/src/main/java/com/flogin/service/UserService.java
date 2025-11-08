package com.flogin.service;

import com.flogin.entity.UserEntity;
import com.flogin.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private UserRepository userRepository;
    public boolean checklogin(String username, String password) {
        Optional<UserEntity> user = userRepository.findByUsername(username);
        // Nếu không có user thì trả về false
        if(user.isEmpty())
        {
            return false;
        }

        // Kiểm tra password
        return user.get().getPassword().equals(password);

    }
}
