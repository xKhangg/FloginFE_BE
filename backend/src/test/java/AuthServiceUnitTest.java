import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.entity.UserEntity;
import com.flogin.repository.UserRepository;
import com.flogin.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
@ExtendWith(MockitoExtension.class)
@DisplayName("Login Service Unit Tests")
public class AuthServiceUnitTest {
    @Mock
    private UserRepository userRepository;
    private AuthService authService;
    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository);
    }

  @Test
    @DisplayName("TC1: Login thanh cong voi credentials hop le")
    void testLoginSuccess() {
      LoginRequest request = new LoginRequest("testuser","Test123");
      UserEntity user = new UserEntity();
      user.setUsername("testuser");
      user.setPassword("Test123");
      when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
      LoginResponse response= authService.authenticate(request);
      assertTrue(response.isSuccess());
      assertEquals("Đăng nhập thành công",response.getMessage());
  }
    @Test
    @DisplayName("TC2: Login that bai voi username sai")
    void testLoginFailure(){
        LoginRequest request = new LoginRequest("wronguser","Pass123");
        UserEntity user = new UserEntity();
        user.setUsername("wronguser");
        user.setPassword("Pass123");
        when(userRepository.findByUsername("wronguser")).thenReturn(Optional.empty());
        LoginResponse response= authService.authenticate(request);
        assertFalse(response.isSuccess());
        assertEquals("Người dùng không tồn tại",response.getMessage());
    }
    @Test
    @DisplayName("TC3: Login that bai voi password rong")
    void testLoginFailure2(){
        LoginRequest request = new LoginRequest("testuser","");
        UserEntity user = new UserEntity();
        user.setUsername("testuser");
        user.setPassword("test123");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        LoginResponse response= authService.authenticate(request);
        assertFalse(response.isSuccess());
        assertEquals("Username/password không đúng",response.getMessage());

    }
    @Test
    @DisplayName("TC4: Login that bai voi password qua ngan")
    void testLoginFailure3(){
        LoginRequest request = new LoginRequest("testuser","test");
        UserEntity user = new UserEntity();
        user.setUsername("testuser");
        user.setPassword("test123");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        LoginResponse response= authService.authenticate(request);
        assertFalse(response.isSuccess());
        assertEquals("Username/password không đúng",response.getMessage());

    }
    @Test
    @DisplayName("TC5:Login that bai voi password chua khoang trang")
    void testLoginFailure4(){
        LoginRequest request = new LoginRequest("testuser","test 789");
        UserEntity user = new UserEntity();
        user.setUsername("testuser");
        user.setPassword("test123");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        LoginResponse response= authService.authenticate(request);
        assertFalse(response.isSuccess());
        assertEquals("Username/password không đúng",response.getMessage());

    }
}



