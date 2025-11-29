package com.flogin.service;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.entity.UserEntity;
import com.flogin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public LoginResponse authenticate(LoginRequest loginRequest) {
        Optional<UserEntity> userOptional = userRepository.findByUsername(loginRequest.getUsername());

        if (userOptional.isEmpty()) {
            return new LoginResponse(false, "Người dùng không tồn tại");
        }

        UserEntity user = userOptional.get();

        if (!user.getPassword().equals(loginRequest.getPassword())) {
            return new LoginResponse(false, "Username/password không đúng");
        }

        return new LoginResponse(true, "Đăng nhập thành công");
    }
//
//    public LoginResponse authenticatetest(LoginRequest loginRequest) {
//        if(loginRequest.getUsername().equals("testuser") && loginRequest.getPassword().equals("Test123"))
//        {
//            return new LoginResponse(true, "Dang nhap thanh cong");
//        }
//        else{
//            return new LoginResponse(false, "Username/password khong dung");
//        }
//}
    }
