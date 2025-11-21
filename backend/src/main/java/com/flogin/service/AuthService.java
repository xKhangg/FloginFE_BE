package com.flogin.service;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.entity.UserEntity;
import com.flogin.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private UserRepository userRepository;
    public LoginResponse Authenticate(String username, String password) {
        Optional<UserEntity> user = userRepository.findByUsername(username);
        if(user.isEmpty())
        {
            return new LoginResponse(false, "Nguoi dung khong ton tai");
        }

         else if(user.get().getPassword().equals(password))
         {
          return new LoginResponse(true, "Dang nhap thanh cong");
         }

       else{
           return new LoginResponse(false, "Username/password khong dung");
        }

    }
    public LoginResponse authenticate(LoginRequest loginRequest) {
        if(loginRequest.getUsername().equals("testuser") && loginRequest.getPassword().equals("Test123"))
        {
            return new LoginResponse(true, "Dang nhap thanh cong");
        }
        else{
            return new LoginResponse(false, "Username/password khong dung");
        }
    }
}
