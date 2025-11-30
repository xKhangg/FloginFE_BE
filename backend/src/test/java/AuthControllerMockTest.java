import com.flogin.FloginApplication;
import com.flogin.controller.AuthController;
import com.flogin.dto.LoginResponse;
import com.flogin.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@ContextConfiguration(classes = {FloginApplication.class})
@AutoConfigureMockMvc(addFilters = false)

public class AuthControllerMockTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private AuthService authService;

    @Test
    @DisplayName("Mock: Controller voi mocked service success")
    void testLoginWithMockedService() throws Exception {
        LoginResponse MockResponse = new LoginResponse(true,"Success","mock-token");
        //ARRANGE
        when(authService.authenticate(any())).thenReturn(MockResponse);
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"test\",\"password\":\"Pass123\"}")
                        .with(csrf()))
                .andExpect(status().isOk());

        //VERIFY
        verify(authService,times(1)).authenticate(any());
    }
    @Test
    @DisplayName("Mock: Controller voi mocked service Failure")
    void testLoginFailureWithMockedService() throws Exception {
        LoginResponse MockResponse = new LoginResponse(false,"Failure","mock-token");
        //ARRANGE
        when(authService.authenticate(any())).thenReturn(MockResponse);
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"wronguser\",\"password\":\"Pass123\"}")
                        .with(csrf()))
                .andExpect(status().isUnauthorized());

        //VERIFY
        verify(authService,times(1)).authenticate(any());
    }
    @Test
    @DisplayName("Mock: Controller voi mocked service Failure because of empty password")
    void testLoginEmptyPassWordWithMockedService() throws Exception {
        LoginResponse MockResponse = new LoginResponse(false,"");
        //ARRANGE
        when(authService.authenticate(any())).thenReturn(MockResponse);
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"testuser123\",\"password\":\"\"}")
                        .with(csrf()))
                .andExpect(status().isBadRequest());

        //VERIFY
        verify(authService,times(1)).authenticate(any());
    }
    @Test
    @DisplayName("Mock: Controller voi mocked service Failure because of invalid password")
    void testLoginInvalidPassWordWithMockedService() throws Exception {
        LoginResponse MockResponse = new LoginResponse(false,"");
        //ARRANGE
        when(authService.authenticate(any())).thenReturn(MockResponse);
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"testuser456\",\"password\":\"123\"}")
                        .with(csrf()))
                .andExpect(status().isBadRequest());

        //VERIFY
        verify(authService,times(1)).authenticate(any());
    }
    @Test
    @DisplayName("Mock: Controller voi mocked service Failure because Password has space")
    void testLoginPasswordhasSpaceWordWithMockedService() throws Exception {
        LoginResponse MockResponse = new LoginResponse(false,"");
        //ARRANGE
        when(authService.authenticate(any())).thenReturn(MockResponse);
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"testuser\",\"password\":\"testuser 456\"}")
                        .with(csrf()))
                .andExpect(status().isBadRequest());

        //VERIFY
        verify(authService,times(1)).authenticate(any());
    }
}


