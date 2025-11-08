package com.flogin.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name="User")
@Getter
@Setter
public class UserEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int id;
    @Size(min = 3, max = 50, message = "Tên người dùng phải từ 3 đến 50 ký tự")
    @Pattern(regexp = "^[A-Za-z0-9._-]+$",message = "Tên người dùng chỉ chứa a-z,A-Z,0-9,-,.,_")
    @Column(unique=true,nullable=false)
    private String username;
    @Size(min = 6,max=100,message = "Mật khẩu phải từ 6 đến 100 ký tự")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$", message = "Mật khẩu phải có chữ và số")
    @Column(nullable=false)
    private String password;
    private boolean enabled;

    public UserEntity(String username, String password)  {
        this.username = username;
        this.password = password;
    }

    public UserEntity() {
    }

}
