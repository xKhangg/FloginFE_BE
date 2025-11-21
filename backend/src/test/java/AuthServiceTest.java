import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Login Service Unit Tests")
public class AuthServiceTest {
    private AuthService authService;
    @BeforeEach
    void setUp() {
        authService = new AuthService();
    }

  @Test
    @DisplayName("TC1: Login thanh cong voi credentials hop le")
    void testLoginSuccess() {
      LoginRequest request = new LoginRequest("testuser","Test123");
      LoginResponse response= AuthService.authenticate(request);
      assertTrue(response.isSuccess());
      assertEquals("Dang nhap thanh cong",response.getMessage());
  }
    @Test
    @DisplayName("TC2: Login that bai voi username sai")
    void testLoginFailure(){
        LoginRequest request = new LoginRequest("wronguser","Pass123");
        LoginResponse response= AuthService.authenticate(request);
        assertFalse(response.isSuccess());
    }
}



