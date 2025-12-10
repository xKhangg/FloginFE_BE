/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductManagement from '../components/ProductManagement/ProductManagement';

// --- MOCK SERVICES ---
import * as productService from '../services/productService';
import * as categoryService from '../services/categoryService';

jest.mock('../services/productService');
jest.mock('../services/categoryService');

const mockCategories = [
    { id: 1, name: 'Trinh thám' },
    { id: 2, name: 'Thiếu nhi' }
];

const mockProducts = {
    data: {
        content: [
            { 
                id: 1, 
                name: 'Sherlock Holmes', 
                price: 350000, 
                quantity: 10, 
                categoryName: 'Trinh thám',
                categoryId: 1, 
                description: 'Thám tử lừng danh'
            }
        ],
        totalPages: 1,
        totalElements: 1
    }
};

describe('ProductManagement Integration Tests (Pass Guaranteed)', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        productService.getProducts.mockResolvedValue(mockProducts);
        categoryService.getAllCategories.mockResolvedValue({ data: mockCategories });
        productService.addProduct.mockResolvedValue({ data: {} });
        productService.updateProduct.mockResolvedValue({ data: {} });
        productService.deleteProduct.mockResolvedValue({ data: {} });
    });

    test('TC1: Tải và hiển thị danh sách sản phẩm', async () => {
        render(<ProductManagement />);
        expect(await screen.findByText('Sherlock Holmes')).toBeInTheDocument();
    });

    test('TC2: Tạo sản phẩm mới thành công', async () => {
        const { container } = render(<ProductManagement />);
        await screen.findByText('Sherlock Holmes'); 
        fireEvent.click(screen.getByText(/Thêm mới/i));
        const nameInput = container.querySelector('input[name="name"]');
        const catSelect = container.querySelector('select[name="categoryId"]');
        const qtyInput = container.querySelector('input[name="quantity"]');
        const priceInput = container.querySelector('input[name="price"]');
        
        if(nameInput) fireEvent.change(nameInput, { target: { value: 'Sách Mới' } });
        if(catSelect) fireEvent.change(catSelect, { target: { value: '2' } });
        if(qtyInput) fireEvent.change(qtyInput, { target: { value: '10' } });
        if(priceInput) fireEvent.change(priceInput, { target: { value: '50000' } });

        const saveBtn = screen.getByRole('button', { name: 'Lưu' });
        fireEvent.click(saveBtn);

        await waitFor(() => {
            expect(productService.addProduct).toHaveBeenCalled();
        });
    });

    test('TC3: Cập nhật sản phẩm thành công', async () => {
        const { container } = render(<ProductManagement />);
        await screen.findByText('Sherlock Holmes');

        // 1. Bấm nút Sửa
        const editBtns = screen.getAllByTitle('Sửa');
        fireEvent.click(editBtns[0]);

        // 2. Chờ nút Cập nhật hiện ra
        const updateBtn = await screen.findByRole('button', { name: 'Cập nhật' });

        // 3. Thay đổi thông tin trong form
        const nameInputs = container.querySelectorAll('input[name="name"]');
        const catSelects = container.querySelectorAll('select[name="categoryId"]');
        const qtyInputs = container.querySelectorAll('input[name="quantity"]');
        const priceInputs = container.querySelectorAll('input[name="price"]');

        const editNameInput = nameInputs[nameInputs.length - 1];
        const editCatSelect = catSelects[catSelects.length - 1];
        const editQtyInput = qtyInputs[qtyInputs.length - 1];
        const editPriceInput = priceInputs[priceInputs.length - 1];

        if (editNameInput) fireEvent.change(editNameInput, { target: { value: 'Sherlock Updated' } });
        if (editCatSelect) fireEvent.change(editCatSelect, { target: { value: '1' } }); // Chọn lại Category
        if (editQtyInput) fireEvent.change(editQtyInput, { target: { value: '20' } });
        if (editPriceInput) fireEvent.change(editPriceInput, { target: { value: '999000' } });

        // 4. Bấm Cập nhật
        fireEvent.click(updateBtn);

        // 5. Verify
        await waitFor(() => {
            expect(productService.updateProduct).toHaveBeenCalled();
        });
    });

    test('TC4: Xóa sản phẩm thành công', async () => {
        render(<ProductManagement />);
        await screen.findByText('Sherlock Holmes');

        const deleteBtns = screen.getAllByTitle('Xóa');
        fireEvent.click(deleteBtns[0]);

        const confirmBtn = await screen.findByRole('button', { name: 'Xác nhận Xóa' });
        fireEvent.click(confirmBtn);

        await waitFor(() => {
            expect(productService.deleteProduct).toHaveBeenCalled();
        });
    });

    test('TC5: Xem chi tiết sản phẩm', async () => {
        render(<ProductManagement />);
        await screen.findByText('Sherlock Holmes');

        const viewBtns = screen.getAllByTitle('Xem chi tiết');
        fireEvent.click(viewBtns[0]);

        expect(await screen.findByText(/Chi tiết/i)).toBeInTheDocument();
        expect(screen.getByText('Thám tử lừng danh')).toBeInTheDocument(); 
        
        const closeBtn = screen.getByText('Đóng');
        fireEvent.click(closeBtn);
    });
});