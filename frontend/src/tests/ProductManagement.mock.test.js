import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductManagement from '../components/ProductManagement/ProductManagement';

// 1. IMPORT SERVICE
import {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct
} from '../services/productService';

// 2. MOCK SERVICE
jest.mock('../services/productService');

// 3. GÁN BIẾN MOCK
const mockedGetProducts = getProducts;
const mockedAddProduct = addProduct;
const mockedUpdateProduct = updateProduct;
const mockedDeleteProduct = deleteProduct;

// 4. DỮ LIỆU GIẢ
const MOCK_BOOKS = [
    { id: 1, name: 'Sherlock Holmes', price: 350000, quantity: 10, categoryName: 'Trinh thám' },
    { id: 2, name: 'Dế Mèn', price: 80000, quantity: 50, categoryName: 'Thiếu nhi' },
];

describe('ProductManagement - Mock Tests (Final Version)', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        // Luôn trả về dữ liệu ngay lập tức
        mockedGetProducts.mockResolvedValue({
            data: { content: MOCK_BOOKS }
        });
    });

    test('Test 1: Tải danh sách thành công', async () => {
        render(<ProductManagement />);
        // Chỉ cần tìm thấy text là được
        expect(await screen.findByText('Sherlock Holmes')).toBeInTheDocument();
        expect(mockedGetProducts).toHaveBeenCalledTimes(1);
    });

    test('Test 2: Thêm sách mới thành công', async () => {
        // Setup mock
        mockedAddProduct.mockResolvedValue({ data: { id: 3, name: 'Sách Mới' } });
        
        render(<ProductManagement />);
        await screen.findByText('Sherlock Holmes'); // Chờ load xong

        // 1. Mở form
        fireEvent.click(screen.getByText('Thêm mới'));

        // 2. Điền form (Tìm input thẳng bằng Label)
        fireEvent.change(screen.getByLabelText(/Tên sản phẩm/i), { target: { value: 'Sách Mới' } });
        fireEvent.change(screen.getByLabelText(/Loại sản phẩm/i), { target: { value: 'Giáo dục' } });
        fireEvent.change(screen.getByLabelText(/Số lượng/i), { target: { value: '10' } });
        fireEvent.change(screen.getByLabelText(/Giá sản phẩm/i), { target: { value: '50000' } });

        // 3. Bấm Lưu
        fireEvent.click(screen.getByRole('button', { name: 'Lưu' }));

        // 4. Kiểm tra hàm addProduct được gọi
        await waitFor(() => {
            expect(mockedAddProduct).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Sách Mới',
                price: 50000
            }));
        });
    });

    test('Test 3: Xóa sách thành công', async () => {
        mockedDeleteProduct.mockResolvedValue({ data: {} });

        render(<ProductManagement />);
        await screen.findByText('Dế Mèn');

        // 1. Click nút xóa (Tìm nút có title="Xóa")
        const deleteBtns = screen.getAllByTitle('Xóa');
        fireEvent.click(deleteBtns[0]); // Xóa cái đầu tiên tìm thấy

        // 2. Click xác nhận
        const confirmBtn = await screen.findByRole('button', { name: 'Xác nhận Xóa' });
        fireEvent.click(confirmBtn);

        // 3. Kiểm tra hàm deleteProduct được gọi
        await waitFor(() => {
            expect(mockedDeleteProduct).toHaveBeenCalled();
        });
    });

    test('Test 4: Báo lỗi khi thêm thất bại', async () => {
        mockedAddProduct.mockRejectedValue(new Error('Lỗi mạng'));

        render(<ProductManagement />);
        await screen.findByText('Sherlock Holmes');

        fireEvent.click(screen.getByText('Thêm mới'));

        // Điền form
        fireEvent.change(screen.getByLabelText(/Tên sản phẩm/i), { target: { value: 'Lỗi' } });
        fireEvent.change(screen.getByLabelText(/Loại sản phẩm/i), { target: { value: 'Lỗi' } });
        fireEvent.change(screen.getByLabelText(/Số lượng/i), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText(/Giá sản phẩm/i), { target: { value: '1' } });

        fireEvent.click(screen.getByRole('button', { name: 'Lưu' }));

        // SỬA LỖI QUAN TRỌNG: Dùng findAllByText
        // Vì trong component có 2 dialog (Thêm & Sửa), lỗi có thể hiện ở cả 2 nơi
        const errorMessages = await screen.findAllByText(/Không thể thêm sản phẩm/i);
        expect(errorMessages.length).toBeGreaterThan(0);
    });

    test('Test 5: Chức năng tìm kiếm ', async () => {
        render(<ProductManagement />);
        
        // 1. Chờ dữ liệu load xong
        expect(await screen.findByText('Sherlock Holmes')).toBeInTheDocument();
        expect(screen.getByText('Dế Mèn')).toBeInTheDocument();

        // 2. Nhập từ khóa tìm kiếm "Sherlock"
        const searchInput = screen.getByPlaceholderText(/Tìm kiếm theo tên/i); 
        fireEvent.change(searchInput, { target: { value: 'Sherlock' } });

        // 3. Kiểm tra kết quả lọc
        // "Sherlock" phải còn hiển thị
        expect(screen.getByText('Sherlock Holmes')).toBeInTheDocument();
        // "Dế Mèn" phải biến mất
        expect(screen.queryByText('Dế Mèn')).not.toBeInTheDocument();
    });
    

});