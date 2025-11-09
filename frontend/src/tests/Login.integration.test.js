import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom'; // Cần thiết vì Login.jsx dùng useNavigate
import Login from '../components/Login/Login'; // Điều chỉnh đường dẫn này tới file Login.jsx của bạn
import * as authService from '../services/authService'; // Điều chỉnh đường dẫn này tới file authService.js của bạn

// 2. Mock module 'react-router-dom' để theo dõi hàm navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Giữ lại các export gốc
  useNavigate: () => mockNavigate, // Ghi đè useNavigate bằng mock
}));

// 3. Mock module validation
// (Giả sử file validation của bạn nằm trong 'src/utils/')
jest.mock('../utils/loginValidation', () => ({
  validateUsername: (user) => {
    if (!user) return 'Tên đăng nhập không được để trống';
    if (user.length < 3) return 'Tên đăng nhập phải có ít nhất 3 ký tự';
    return '';
  },
  validatePassword: (pass) => {
    if (!pass) return 'Mật khẩu không được để trống';
    if (pass.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
    return '';
  },
}));

// 4. Mock authService
let loginSpy;

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  // Spy vào hàm 'login' mà file authService.js của bạn export
  loginSpy = jest.spyOn(authService, 'login');
});

describe('Login Component Integration Tests (Dựa trên file Login.jsx)', () => {

  /**
   * Test kịch bản 1: Lỗi Validation
   */
  test('Hiển thị lỗi validation khi submit form rỗng', async () => {
    render(<Login />, { wrapper: BrowserRouter });

    const submitButton = screen.getByRole('button', { name: /đăng nhập/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Tên đăng nhập không được để trống')).toBeInTheDocument();
      expect(screen.getByText('Mật khẩu không được để trống')).toBeInTheDocument();
    });

    expect(loginSpy).not.toHaveBeenCalled();
  });

  /**
   * Test kịch bản 2: Lỗi API
   */
  test('Hiển thị lỗi API khi đăng nhập thất bại', async () => {
    const errorMessage = "Tên đăng nhập hoặc mật khẩu không chính xác.";
    // Mock hàm 'login' trả về lỗi (từ chối promise)
    loginSpy.mockRejectedValue(new Error(errorMessage));

    render(<Login />, { wrapper: BrowserRouter });

    fireEvent.change(screen.getByLabelText(/tên đăng nhập/i), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByLabelText(/mật khẩu/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));

    await waitFor(() => {
      // Tìm lỗi API dựa trên logic file Login.jsx
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  /**
   * Test kịch bản 3: Đăng nhập thành công (Happy Path) - ĐÃ CẬP NHẬT
   */
  test('Đăng nhập thành công, lưu token và chuyển hướng', async () => {
    const successResponse = {
      data: {
        token: "mock-admin-token-xyz789",
        user: { username: "admin" } // Cập nhật user
      }
    };
    // Mock hàm 'login' trả về thành công
    loginSpy.mockResolvedValue(successResponse);

    const localStorageSpy = jest.spyOn(Storage.prototype, 'setItem');
    render(<Login />, { wrapper: BrowserRouter });


    fireEvent.change(screen.getByLabelText(/tên đăng nhập/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/mật khẩu/i), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));

    await waitFor(() => {
      // Đảm bảo 'expect' khớp với 2 dòng 'fireEvent' ở trên
      expect(loginSpy).toHaveBeenCalledWith('admin', 'admin123');
    });


    expect(localStorageSpy).toHaveBeenCalledWith('userToken', successResponse.data.token);
    expect(mockNavigate).toHaveBeenCalledWith('/products');
  });
});