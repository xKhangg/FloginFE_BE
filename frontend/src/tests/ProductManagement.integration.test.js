/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductManagement from '../components/ProductManagement/ProductManagement';

// --- IMPORT & MOCK SERVICES ---
import * as productService from '../services/productService';
import * as categoryService from '../services/categoryService';

jest.mock('../services/productService');
jest.mock('../services/categoryService');

const mockedGetProducts = productService.getProducts;
const mockedAddProduct = productService.addProduct;
const mockedUpdateProduct = productService.updateProduct;
const mockedDeleteProduct = productService.deleteProduct;
const mockedGetAllCategories = categoryService.getAllCategories;

// --- DỮ LIỆU TEST GIẢ LẬP ---
const mockCategories = [
    { id: 1, name: 'Trinh thám' },
    { id: 2, name: 'Thiếu nhi' },
    { id: 3, name: 'Khoa học' }
];

const mockProductsPage1 = {
    data: {
        content: [
            { id: 1, name: 'Sherlock Holmes', price: 350000, quantity: 10, categoryName: 'Trinh thám' },
            { id: 2, name: 'Dế Mèn', price: 80000, quantity: 50, categoryName: 'Thiếu nhi' }
        ],
        totalPages: 2, // Giả lập có 2 trang
        totalElements: 12
    }
};

describe('ProductManagement Integration Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        // Luôn mock sẵn 2 API này vì component gọi ngay khi mount
        mockedGetAllCategories.mockResolvedValue({ data: mockCategories });
        mockedGetProducts.mockResolvedValue(mockProductsPage1);
    });

    test('TC1: Tải và hiển thị danh sách sản phẩm + Categories', async () => {
        render(<ProductManagement />);

        // 1. Kiểm tra API được gọi
        await waitFor(() => {
            expect(mockedGetAllCategories).toHaveBeenCalledTimes(1);
            expect(mockedGetProducts).toHaveBeenCalledTimes(1);
        });

        // 2. Kiểm tra dữ liệu hiển thị
        expect(await screen.findByText('Sherlock Holmes')).toBeInTheDocument();
        expect(screen.getByText('Dế Mèn')).toBeInTheDocument();
        
        // 3. Kiểm tra Dropdown lọc đã có dữ liệu (Optional)
        const filterSelect = screen.getByDisplayValue('Tất cả'); // Tìm combobox lọc
        expect(filterSelect).toBeInTheDocument();
    });

    test('TC2: Tạo sản phẩm mới (Chọn Category từ Dropdown)', async () => {
        const newProduct = { id: 3, name: 'Sách Mới', price: 100000, quantity: 20, categoryName: 'Khoa học' };
        
        mockedAddProduct.mockResolvedValue({ data: newProduct });
        // Mock lần gọi tiếp theo của getProducts để trả về danh sách đã cập nhật
        mockedGetProducts
            .mockResolvedValueOnce(mockProductsPage1) // Lần đầu
            .mockResolvedValueOnce({ 
                data: { content: [newProduct], totalPages: 2 } 
            }); 

        render(<ProductManagement />);
        await screen.findByText('Sherlock Holmes'); // Chờ load xong

        // 1. Mở Dialog Thêm mới
        fireEvent.click(screen.getByText(/Thêm mới/i));
        const addDialog = await screen.findByRole('dialog', { name: /thêm sản phẩm mới/i });

        // 2. Điền form
        fireEvent.change(within(addDialog).getByLabelText(/tên sản phẩm/i), { target: { value: 'Sách Mới' } });
        fireEvent.change(within(addDialog).getByLabelText(/giá sản phẩm/i), { target: { value: '100000' } });
        fireEvent.change(within(addDialog).getByLabelText(/số lượng/i), { target: { value: '20' } });

        // --- QUAN TRỌNG: Chọn Category từ Dropdown ---
        const categorySelect = within(addDialog).getByLabelText(/loại sản phẩm/i);
        fireEvent.change(categorySelect, { target: { value: 'Khoa học' } }); 

        // 3. Submit
        fireEvent.click(within(addDialog).getByRole('button', { name: 'Lưu' }));

        // 4. Verify
        await waitFor(() => {
            expect(mockedAddProduct).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Sách Mới',
                categoryName: 'Khoa học'
            }));
        });
    });

    test('TC3: Cập nhật sản phẩm', async () => {
        mockedUpdateProduct.mockResolvedValue({ data: {} });

        render(<ProductManagement />);
        await screen.findByText('Sherlock Holmes');

        // 1. Click Sửa
        const row = screen.getAllByRole('row').find(r => within(r).queryByText('Sherlock Holmes'));
        fireEvent.click(within(row).getByTitle('Sửa'));

        // 2. Dialog hiện ra, sửa giá
        const editDialog = await screen.findByRole('dialog', { name: /cập nhật sản phẩm/i });
        const priceInput = within(editDialog).getByLabelText(/giá sản phẩm/i);
        fireEvent.change(priceInput, { target: { value: '500000' } });

        // 3. Submit
        fireEvent.click(within(editDialog).getByRole('button', { name: 'Cập nhật' }));

        // 4. Verify
        await waitFor(() => {
            expect(mockedUpdateProduct).toHaveBeenCalledWith(1, expect.objectContaining({
                price: 500000
            }));
        });
    });

    test('TC4: Xóa sản phẩm', async () => {
        mockedDeleteProduct.mockResolvedValue({});

        render(<ProductManagement />);
        await screen.findByText('Sherlock Holmes');

        // 1. Click Xóa
        const row = screen.getAllByRole('row').find(r => within(r).queryByText('Sherlock Holmes'));
        fireEvent.click(within(row).getByTitle('Xóa'));

        // 2. Dialog xác nhận
        const confirmDialog = await screen.findByRole('dialog', { name: /xác nhận xóa/i });
        fireEvent.click(within(confirmDialog).getByRole('button', { name: 'Xác nhận Xóa' }));

        // 3. Verify
        await waitFor(() => {
            expect(mockedDeleteProduct).toHaveBeenCalledWith(1);
        });
    });

    test('TC5: Chuyển trang (Pagination)', async () => {
        render(<ProductManagement />);
        await screen.findByText('Sherlock Holmes');

        // Tìm nút "Sau" (Next)
        const nextButton = screen.getByText('Sau');
        
        // Click chuyển trang
        fireEvent.click(nextButton);

        // Verify: API được gọi với page=1 (trang 2)
        await waitFor(() => {
            expect(mockedGetProducts).toHaveBeenCalledWith(1, 'All'); // page 1, category 'All'
        });
    });
});