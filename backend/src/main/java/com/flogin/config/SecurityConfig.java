package com.flogin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // <-- Import này
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // ----------------------------------------------------------------
                // 1. CORS Configuration (Cấu hình CORS)
                // ----------------------------------------------------------------
                // Quan trọng: Phải kích hoạt nó trong filter chain để nó dùng bean bên dưới
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Tắt CSRF (cho API stateless)
                .csrf(AbstractHttpConfigurer::disable)

                // ----------------------------------------------------------------
                // 2. HTTPS Enforcement (Bắt buộc dùng HTTPS)
                // ----------------------------------------------------------------
//                .requiresChannel(channel ->
//                        channel.anyRequest().requiresSecure() // Bắt buộc mọi request phải qua HTTPS
//                )

                // ----------------------------------------------------------------
                // 3. Security Headers (Các header bảo mật)
                // ----------------------------------------------------------------
                .headers(headers -> headers
                        // HSTS: Bắt buộc trình duyệt nhớ dùng HTTPS trong tương lai (1 năm)
                        .httpStrictTransportSecurity(hsts -> hsts
                                .includeSubDomains(true)
                                .maxAgeInSeconds(31536000)
                        )
                        // Chống Clickjacking (không cho phép trang web bị nhúng vào iframe)
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::deny)
                        // Chống XSS (Cross-Site Scripting) cơ bản
                        .xssProtection(xss -> xss.headerValue(org.springframework.security.web.header.writers.XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
                        // Ngăn chặn trình duyệt "đoán" sai Content-Type
                        .contentTypeOptions(HeadersConfigurer.ContentTypeOptionsConfig::disable)
                        // Content Security Policy (CSP): Chỉ cho phép tải tài nguyên từ chính domain này
                        .contentSecurityPolicy(csp -> csp
                                .policyDirectives("default-src 'self'; script-src 'self'; object-src 'none';")
                        )
                )

                // Cấu hình quyền truy cập (Như cũ)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/products**", "/api/products/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/error").permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Chỉ cho phép các origin cụ thể (frontend)
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173"));

        // Các method được phép
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Các header được phép
        configuration.setAllowedHeaders(List.of("*"));

        // Cho phép gửi credentials (cookie, auth headers)
        configuration.setAllowCredentials(true);

        // Cache pre-flight request trong 1 giờ (3600s) để giảm tải cho server
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt là thuật toán băm mật khẩu mạnh và phổ biến nhất hiện nay
        return new BCryptPasswordEncoder();
    }
}