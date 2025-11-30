package com.flogin.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;


@Entity
@Table(name="users")

public class UserEntity {
    @Id
    //Tự động gán Id (tự tăng)
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int id;
    @Getter
    @Setter
    //@Size kiểm tra độ dài chuỗi
    @Size(min = 3, max = 50, message = "Tên người dùng phải từ 3 đến 50 ký tự")
    @Pattern(regexp = "^[A-Za-z0-9._-]+$",message = "Tên người dùng chỉ chứa a-z,A-Z,0-9,-,.,_")
    //Cột(không được null, mỗi username là duy nhất)
    @Column(unique=true,nullable=false)
    private String username;
    @Getter
    @Setter
    //@Size kiểm tra độ dài chuỗi
    @Size(min = 6,max=100,message = "Mật khẩu phải từ 6 đến 100 ký tự")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$", message = "Mật khẩu phải có chữ và số")
    // 'nullable = false' bắt buộc tài khoản phải có password
    @Column(nullable=false)
    private String password;


    public UserEntity(String username, String password)  {
        this.username = username;
        this.password = password;
    }

    public UserEntity() {
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
