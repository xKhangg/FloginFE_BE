import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductForm from '../components/ProductManagement/ProductForm';

describe('Product Form Component Tests (Câu 3.2.1 b)', () => {
    
    // Test 1: Kiểm tra render các trường
    test('Nên hiển thị đầy đủ các trường nhập liệu', () => {
        render(<ProductForm />);
        
        expect(screen.getByLabelText(/Tên sản phẩm/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Loại sản phẩm/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Giá/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Số lượng/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Mô tả/i)).toBeInTheDocument();
        
        expect(screen.getByRole('button', { name: /Lưu/i })).toBeInTheDocument();
    });

    // Test 2: Kiểm tra Validation (Lỗi khi submit rỗng)
    test('Nên hiển thị lỗi khi submit form rỗng', () => {
        render(<ProductForm />);
        
        fireEvent.click(screen.getByText('Lưu'));

        expect(screen.getByText('Tên sản phẩm là bắt buộc')).toBeInTheDocument();
        expect(screen.getByText('Giá phải lớn hơn 0')).toBeInTheDocument();
        expect(screen.getByText('Số lượng không hợp lệ')).toBeInTheDocument(); 
        expect(screen.getByText('Loại sản phẩm là bắt buộc')).toBeInTheDocument();
    });

    // Test 3: Nhập liệu đúng và Submit thành công
   test('Nên gọi hàm onSubmit khi nhập liệu hợp lệ', () => {
        const handleSubmit = jest.fn();
        render(<ProductForm onSubmit={handleSubmit} />);

        // Điền form
        fireEvent.change(screen.getByLabelText(/Tên sản phẩm/i), { target: { value: 'Sách Test' } });
        fireEvent.change(screen.getByLabelText(/Loại sản phẩm/i), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText(/Giá/i), { target: { value: '50000' } });
        fireEvent.change(screen.getByLabelText(/Số lượng/i), { target: { value: '10' } });
        fireEvent.change(screen.getByLabelText(/Mô tả/i), { target: { value: 'Sách hay lắm' } });

        // Submit
        fireEvent.click(screen.getByText('Lưu'));

        expect(handleSubmit).toHaveBeenCalledWith({
            name: 'Sách Test',
            categoryId: 1,       
            price: 50000,        
            quantity: 10,        
            description: 'Sách hay lắm'
        });
    });
});