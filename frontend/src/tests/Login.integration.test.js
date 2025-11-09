import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom'; // Cần thiết vì Login.jsx dùng useNavigate
import Login from '../components/Login/Login';
import * as authService from '../services/authService';

// 2. Mock module 'react-router-dom' để theo dõi hàm navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Giữ lại các export gốc
  useNavigate: () => mockNavigate, // Ghi đè useNavigate bằng mock
}));

// 3. Mock module validation
// Đã cập nhật: Đường dẫn từ 'src/tests/' đến 'src/utils/loginValidation.js'
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
   * Test kịch bản 3: Đăng nhập thành công (Happy Path)
   */
  test('Đăng nhập thành công, lưu token và chuyển hướng', async () => {
    const successResponse = {
      data: {
        token: "mock-admin-token-xyz789",
        user: { username: "testuser" }
      }
    };
    loginSpy.mockResolvedValue(successResponse);

    const localStorageSpy = jest.spyOn(Storage.prototype, 'setItem');
    render(<Login />, { wrapper: BrowserRouter });

    // Dùng credentials hợp lệ từ file authService.js
    fireEvent.change(screen.getByLabelText(/tên đăng nhập/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/mật khẩu/i), { target: { value: 'Test123' } });
    fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));

    await waitFor(() => {
      expect(loginSpy).toHaveBeenCalledWith('testuser', 'Test123');
    });


    expect(localStorageSpy).toHaveBeenCalledWith('userToken', successResponse.data.token);

    expect(mockNavigate).toHaveBeenCalledWith('/products');
  });
});