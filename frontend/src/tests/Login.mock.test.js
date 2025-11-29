import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Login from '../components/Login/Login'; // Kiểm tra đường dẫn này

// 1. IMPORT HÀM TỪ SERVICE
import { login } from '../services/authService'; // Kiểm tra đường dẫn này

// 2. MOCK SERVICE
jest.mock('../services/authService');
// 3. MOCK ROUTER (Để xử lý useNavigate)
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Login - Mock Tests (Câu 4.1)', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // TEST CASE 1: Đăng nhập thành công
    test('TC1: Đăng nhập thành công gọi API và chuyển hướng', async () => {
        // Arrange: Giả lập API trả về thành công
        login.mockResolvedValue({
            data: { token: 'fake-token-123' }
        });

        // Act: Render và thao tác
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Tên đăng nhập/i), { target: { value: 'admin' } });
        fireEvent.change(screen.getByLabelText(/Mật khẩu/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));

        // Assert: Kiểm tra kết quả
        await waitFor(() => {
            expect(login).toHaveBeenCalledWith('admin', 'password123');
        });

        // Kiểm tra đã chuyển hướng chưa
        expect(mockedNavigate).toHaveBeenCalledWith('/products');
    });

    // TEST CASE 2: Đăng nhập thất bại
    test('TC2: Hiển thị lỗi khi API trả về thất bại', async () => {
        // Arrange: Giả lập API trả về lỗi
        const errorMessage = 'Sai tài khoản hoặc mật khẩu';
        login.mockRejectedValue(new Error(errorMessage));

        // Act
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Tên đăng nhập/i), { target: { value: 'wronguser' } });
        fireEvent.change(screen.getByLabelText(/Mật khẩu/i), { target: { value: 'wrongpass1' } });
        fireEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));

        // Assert: Kiểm tra kết quả
        // Bây giờ API sẽ được gọi, bị từ chối, và thông báo lỗi sẽ hiện ra
        await waitFor(() => {
            // Kiểm tra thông báo lỗi có hiện ra không
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });

        // Đảm bảo không chuyển trang
        expect(mockedNavigate).not.toHaveBeenCalled();
    });
});