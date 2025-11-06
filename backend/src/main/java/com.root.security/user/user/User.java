package com.root.security.user.user;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="User")
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int id;
    @Column(unique=true,nullable=false)
    private String username;
    @Column(nullable=false)
    private String password;
    @Column(unique=true,nullable=false)
    private String email;

    public User(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }
    public User() {
    }

}
