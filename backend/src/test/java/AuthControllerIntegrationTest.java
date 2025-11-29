

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.FloginApplication;
import com.flogin.controller.AuthController;
import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.dto.UserDTO;
import com.flogin.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@ContextConfiguration(classes = FloginApplication.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("Login API Integration Tests")
public class AuthControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private AuthService authService;

    @Test
    @DisplayName("POST /api/auth/login - Thanh cong")
   public void testLoginSuccess() throws Exception{
        LoginRequest request = new LoginRequest("testuser","Test123");
        LoginResponse MockResponse = new LoginResponse(true,"Dang nhap thanh cong","token123",new UserDTO("testuser","testuser@example.com"));

        when(authService.authenticate(any(LoginRequest.class))).thenReturn(MockResponse);
        mockMvc.perform(post ("/api/auth/login")
                        .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.token").exists());
    }
    @Test
    @DisplayName("POST /api/auth/login - That bai")
    public void testLoginFailure() throws Exception{
        LoginRequest request = new LoginRequest("Wronguser","Test123");
        LoginResponse MockResponse = new LoginResponse(false,"Dang nhap that bai");

        when(authService.authenticate(any(LoginRequest.class))).thenReturn(MockResponse);
        mockMvc.perform(post ("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Dang nhap that bai"))
                .andExpect(jsonPath("$.token").doesNotExist());
    }
    @Test
    @DisplayName("POST /api/auth/login - That bai vì nguoi dung khong ton tai")
    public void testLoginFailureWithInvalidUser() throws Exception{
        LoginRequest request = new LoginRequest("InvalidUser","Test123");
        LoginResponse MockResponse = new LoginResponse(false,"Người dùng không tồn tại");

        when(authService.authenticate(any(LoginRequest.class))).thenReturn(MockResponse);
        mockMvc.perform(post ("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Người dùng không tồn tại"))
                .andExpect(jsonPath("$.token").doesNotExist());
    }
    @Test
    @DisplayName("POST /api/auth/login - That bai vi sai mat khau")
    public void testLoginFailureWithInvalidPassword() throws Exception{
        LoginRequest request = new LoginRequest("User123","Wrongpassword");
        LoginResponse MockResponse = new LoginResponse(false,"");

        when(authService.authenticate(any(LoginRequest.class))).thenReturn(MockResponse);
        mockMvc.perform(post ("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.token").doesNotExist());
    }


}
