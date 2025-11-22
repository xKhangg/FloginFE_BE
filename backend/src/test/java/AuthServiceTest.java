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
      LoginResponse response= authService.authenticate(request);
      assertTrue(response.isSuccess());
      assertEquals("Dang nhap thanh cong",response.getMessage());
  }
    @Test
    @DisplayName("TC2: Login that bai voi username sai")
    void testLoginFailure(){
        LoginRequest request = new LoginRequest("wronguser","Pass123");
        LoginResponse response= authService.authenticate(request);
        assertFalse(response.isSuccess());
        assertEquals("Username/password khong dung",response.getMessage());
    }
    @Test
    @DisplayName("TC3: Login that bai voi password rong")
    void testLoginFailure2(){
        LoginRequest request = new LoginRequest("user123","");
        LoginResponse response= authService.authenticate(request);
        assertFalse(response.isSuccess());
    }
    @Test
    @DisplayName("TC4: Login that bai voi password qua ngan")
    void testLoginFailure3(){
        LoginRequest request = new LoginRequest("test456","test");
        LoginResponse response= authService.authenticate(request);
        assertFalse(response.isSuccess());
    }
    @Test
    @DisplayName("TC5:Login that bai voi password chua khoang trang")
    void testLoginFailure4(){
        LoginRequest request = new LoginRequest("test789","test 789");
        LoginResponse response= authService.authenticate(request);
        assertFalse(response.isSuccess());
    }
}



