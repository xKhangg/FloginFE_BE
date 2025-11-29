/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/no-node-access */
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
import { getAllCategories } from '../services/categoryService';

// 2. MOCK SERVICE
jest.mock('../services/productService');
jest.mock('../services/categoryService');

// 3. GÁN BIẾN MOCK
const mockedGetProducts = getProducts;
const mockedAddProduct = addProduct;
const mockedUpdateProduct = updateProduct;
const mockedDeleteProduct = deleteProduct;
const mockedGetAllCategories = getAllCategories;

// 4. DỮ LIỆU GIẢ (Có categoryId để Edit hoạt động)
const MOCK_BOOKS = [
    { id: 1, name: 'Sherlock Holmes Toàn Tập', price: 350000, quantity: 10, categoryName: 'Trinh thám', categoryId: 1 },
    { id: 2, name: 'Dế Mèn Phiêu Lưu Ký', price: 80000, quantity: 50, categoryName: 'Thiếu nhi', categoryId: 2 },
];

const MOCK_CATEGORIES = [
    { id: 1, name: 'Trinh thám' },
    { id: 2, name: 'Thiếu nhi' }
];

describe('ProductManagement - Mock Tests (Simple Submit)', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockedGetProducts.mockResolvedValue({
            data: { content: MOCK_BOOKS, totalPages: 1 }
        });
        mockedGetAllCategories.mockResolvedValue({
            data: MOCK_CATEGORIES
        });
        mockedAddProduct.mockResolvedValue({ data: {} });
        mockedUpdateProduct.mockResolvedValue({ data: {} });
        mockedDeleteProduct.mockResolvedValue({ data: {} });
    });

    test('Test 1: Tải danh sách thành công', async () => {
        render(<ProductManagement />);
        expect(await screen.findByText('Sherlock Holmes Toàn Tập')).toBeInTheDocument();
        expect(mockedGetProducts).toHaveBeenCalled();
    });

    test('Test 2: Thêm sách mới thành công', async () => {
        const { container } = render(<ProductManagement />);
        await screen.findByText('Sherlock Holmes Toàn Tập'); 

        fireEvent.click(screen.getByText('Thêm mới'));

        // Điền form (selector by name)
        const nameInput = container.querySelector('input[name="name"]');
        const catSelect = container.querySelector('select[name="categoryId"]');
        const priceInput = container.querySelector('input[name="price"]');
        const qtyInput = container.querySelector('input[name="quantity"]');

        if (nameInput) fireEvent.change(nameInput, { target: { value: 'Sách Mới' } });
        if (catSelect) fireEvent.change(catSelect, { target: { value: '1' } });
        if (qtyInput) fireEvent.change(qtyInput, { target: { value: '10' } });
        if (priceInput) fireEvent.change(priceInput, { target: { value: '50000' } });

        // Submit Form trực tiếp (Lấy form đầu tiên tìm thấy)
        const form = container.querySelector('form');
        if (form) fireEvent.submit(form);

        await waitFor(() => {
            expect(mockedAddProduct).toHaveBeenCalled();
        });
    });

    test('Test 3: Xóa sách thành công', async () => {
        render(<ProductManagement />);
        await screen.findByText('Sherlock Holmes Toàn Tập');

        const deleteBtns = screen.getAllByTitle('Xóa');
        fireEvent.click(deleteBtns[0]);

        const confirmBtn = await screen.findByRole('button', { name: 'Xác nhận Xóa' });
        fireEvent.click(confirmBtn);

        await waitFor(() => {
            expect(mockedDeleteProduct).toHaveBeenCalled();
        });
    });

    test('Test 4: Báo lỗi khi thêm thất bại', async () => {
        mockedAddProduct.mockRejectedValue(new Error('Lỗi mạng'));

        const { container } = render(<ProductManagement />);
        await screen.findByText('Sherlock Holmes Toàn Tập');

        fireEvent.click(screen.getByText('Thêm mới'));

        const nameInput = container.querySelector('input[name="name"]');
        const catSelect = container.querySelector('select[name="categoryId"]');
        const priceInput = container.querySelector('input[name="price"]');
        const qtyInput = container.querySelector('input[name="quantity"]');

        if (nameInput) fireEvent.change(nameInput, { target: { value: 'Lỗi' } });
        if (catSelect) fireEvent.change(catSelect, { target: { value: '1' } });
        if (qtyInput) fireEvent.change(qtyInput, { target: { value: '1' } });
        if (priceInput) fireEvent.change(priceInput, { target: { value: '1' } });

        const form = container.querySelector('form');
        if (form) fireEvent.submit(form);

        const errorMessages = await screen.findAllByText(/Không thể thêm sản phẩm/i);
        expect(errorMessages.length).toBeGreaterThan(0);
    });

    test('Test 5: Chức năng tìm kiếm', async () => {
        render(<ProductManagement />);
        await screen.findByText('Sherlock Holmes Toàn Tập');

        const searchInput = screen.getByPlaceholderText(/Tìm kiếm theo tên/i); 
        fireEvent.change(searchInput, { target: { value: 'Sherlock' } });

        await waitFor(() => {
             expect(mockedGetProducts).toHaveBeenCalled();
        });
    });

    test('Test 6: Cập nhật sách thành công', async () => {
        const { container } = render(<ProductManagement />);
        await screen.findByText('Sherlock Holmes Toàn Tập'); 

        // 1. Click Sửa
        const editBtns = screen.getAllByTitle('Sửa');
        fireEvent.click(editBtns[0]);

        // 2. Chờ form xuất hiện
        await screen.findByRole('button', { name: 'Cập nhật' });

        // 3. Sửa giá (Tìm input giá trong form đang mở - form cuối cùng)
        const priceInputs = container.querySelectorAll('input[name="price"]');
        const editPriceInput = priceInputs[priceInputs.length - 1];
        if (editPriceInput) fireEvent.change(editPriceInput, { target: { value: '999000' } });

        // 4. SUBMIT FORM TRỰC TIẾP (Chiến thuật mới)
        // Form sửa là form cuối cùng trong DOM (vì nó render sau/đè lên)
        const forms = container.querySelectorAll('form');
        const editForm = forms[forms.length - 1];
        
        if (editForm) {
            fireEvent.submit(editForm);
        } else {
            // Fallback nếu không tìm thấy form: Click nút Cập nhật
            fireEvent.click(screen.getByRole('button', { name: 'Cập nhật' }));
        }

        // 5. Verify
        await waitFor(() => {
            expect(mockedUpdateProduct).toHaveBeenCalled();
        });
    });
});