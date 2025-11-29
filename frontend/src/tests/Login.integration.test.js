import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../components/Login/Login';
import * as authService from '../services/authService';

// --- MOCK REACT ROUTER DOM ---
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Link: ({ children, ...props }) => <a {...props}>{children}</a>,
}));

// --- MOCK VALIDATION ---
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

// --- MOCK AUTH SERVICE ---
let loginSpy;

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  loginSpy = jest.spyOn(authService, 'login');
});

describe('Login Component Integration Tests (Login.jsx)', () => {
  /**
   * Test 1: Hiển thị lỗi validation khi submit form rỗng
   */
  test('Hiển thị lỗi validation khi submit form rỗng', async () => {
    render(<Login />);

    const submitButton = screen.getByRole('button', { name: /đăng nhập/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Tên đăng nhập không được để trống')).toBeInTheDocument();
    });

    expect(screen.getByText('Mật khẩu không được để trống')).toBeInTheDocument();

    expect(loginSpy).not.toHaveBeenCalled();
  });

  /**
   * Test 2: Hiển thị lỗi API khi đăng nhập thất bại
   */
  test('Hiển thị lỗi API khi đăng nhập thất bại', async () => {
    const errorMessage = 'Tên đăng nhập hoặc mật khẩu không chính xác.';
    loginSpy.mockRejectedValue(new Error(errorMessage));

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/tên đăng nhập/i), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByLabelText(/mật khẩu/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  /**
   * Test 3: Đăng nhập thành công
   */
  test('Đăng nhập thành công, lưu token và chuyển hướng', async () => {
    const successResponse = {
      data: {
        token: 'mock-admin-token-xyz789',
        user: { username: 'admin' },
      },
    };
    loginSpy.mockResolvedValue(successResponse);

    const localStorageSpy = jest.spyOn(Storage.prototype, 'setItem');
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/tên đăng nhập/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/mật khẩu/i), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));

    await waitFor(() => {
      expect(loginSpy).toHaveBeenCalledWith('admin', 'admin123');
    });

    expect(localStorageSpy).toHaveBeenCalledWith('userToken', successResponse.data.token);
    expect(mockNavigate).toHaveBeenCalledWith('/products');
  });
});