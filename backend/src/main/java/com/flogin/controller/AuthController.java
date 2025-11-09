package com.flogin.controller;

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
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody String username, @RequestBody String password) {
        boolean success = userService.checklogin(username, password);
        if(success)
        {
            return ResponseEntity.ok("Login thành công");
        }
        else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Tên đăng nhập hoặc mật khẩu không đúng");
        }
    }
}
