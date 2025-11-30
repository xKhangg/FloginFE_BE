package com.flogin.controller;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") //Dùng @CrossOrigin thay vì WebConfig cho nhanh vì chỉ có 2 Controller
public class AuthController {

    @Autowired
    private AuthService userService;

    /*
    @PostMapping("/login): Bạn đang định nghĩa một Biến đường dẫn (Path Variable). URL mà Spring Boot mong đợi sẽ là: /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = userService.authenticate(loginRequest);

        if(response.isSuccess())
        {
            return ResponseEntity.ok(response);
        }
        else if(response.getMessage().isEmpty()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}
