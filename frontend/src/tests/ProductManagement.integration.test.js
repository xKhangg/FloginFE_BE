import React from 'react';
// Import 'within' để sửa lỗi "multiple elements"
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import component và service
import ProductManagement from '../components/ProductManagement/ProductManagement';
import * as productService from '../services/productService';

// Mock các hàm service
let getProductsSpy;
let addProductSpy;
let updateProductSpy;
let deleteProductSpy;

// dữ liệu test
const mockProduct1 = {
  id: 1,
  name: 'Sherlock Holmes Toàn Tập',
  price: 350000,
  quantity: 50,
  categoryName: 'Trinh thám',
  description: 'Tuyển tập các vụ án kinh điển...',
};

const mockProduct2 = {
  id: 3,
  name: 'Dế Mèn Phiêu Lưu Ký',
  price: 80000,
  quantity: 100,
  categoryName: 'Thiếu nhi',
  description: 'Tác giả: Tô Hoài.',
};

const mockProductsResponse = {
  data: {
    content: [mockProduct1, mockProduct2],
  },
};

beforeEach(() => {
  // Reset các spy và localStorage trước mỗi test
  jest.clearAllMocks();
  localStorage.clear();

  // Thiết lập spy cho từng hàm
  getProductsSpy = jest.spyOn(productService, 'getProducts');
  addProductSpy = jest.spyOn(productService, 'addProduct');
  updateProductSpy = jest.spyOn(productService, 'updateProduct');
  deleteProductSpy = jest.spyOn(productService, 'deleteProduct');
});

describe('ProductManagement Component Integration Tests', () => {
  /**
   * Test kịch bản 1: (READ) Hiển thị danh sách sản phẩm
   */
  test('nên tải và hiển thị danh sách sản phẩm khi render', async () => {
    getProductsSpy.mockResolvedValue(mockProductsResponse);

    render(<ProductManagement />);

    expect(getProductsSpy).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByText('Sherlock Holmes Toàn Tập')).toBeInTheDocument();
      expect(screen.getByText('Dế Mèn Phiêu Lưu Ký')).toBeInTheDocument();
    });
  });

  /**
   * Test kịch bản 2: (CREATE) Tạo sản phẩm mới thành công
   */
  test('nên tạo sản phẩm mới thành công', async () => {
    const newBook = {
      id: 6,
      name: 'Sách Mới',
      price: 150000,
      quantity: 20,
      categoryName: 'Mới',
    };
    getProductsSpy.mockResolvedValueOnce({ data: { content: [] } }) // Lần 1
                   .mockResolvedValueOnce({ data: { content: [newBook] } }); // Lần 2

    addProductSpy.mockResolvedValue({ data: newBook });

    render(<ProductManagement />);

    fireEvent.click(screen.getByText(/thêm mới/i));

    fireEvent.change(screen.getByLabelText(/tên sản phẩm/i), { target: { value: newBook.name } });
    fireEvent.change(screen.getByLabelText(/loại sản phẩm/i), { target: { value: newBook.categoryName } });
    fireEvent.change(screen.getByLabelText(/số lượng/i), { target: { value: newBook.quantity } });
    fireEvent.change(screen.getByLabelText(/giá sản phẩm/i), { target: { value: newBook.price } });

    fireEvent.click(screen.getByRole('button', { name: 'Lưu' }));

    await waitFor(() => {
      expect(addProductSpy).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
        expect(getProductsSpy).toHaveBeenCalledTimes(2);
    });

    expect(screen.getByText('Sách Mới')).toBeInTheDocument();
  });

  /**
   * Test kịch bản 3: (UPDATE) Cập nhật sản phẩm (ĐÃ SỬA)
   */
  test('nên cập nhật sản phẩm thành công', async () => {
    getProductsSpy.mockResolvedValue({ data: { content: [mockProduct1] } });
    updateProductSpy.mockResolvedValue({ data: { ...mockProduct1, price: 400000 } });

    render(<ProductManagement />);

    await screen.findByText('Sherlock Holmes Toàn Tập');

    fireEvent.click(screen.getByTitle('Sửa'));

    // Phải dùng 'getAllBy...' vì label 'Giá sản phẩm' xuất hiện ở cả 2 dialog
    const priceInput = screen.getAllByLabelText(/giá sản phẩm/i).find(input => input.closest('form'));
    fireEvent.change(priceInput, { target: { value: '400000' } });

    fireEvent.click(screen.getByRole('button', { name: 'Cập nhật' }));

    // 4. Chờ API được gọi (SỬA LỖI Ở ĐÂY)
    await waitFor(() => {
      // Sửa "400000" (string) thành 400000 (number) để khớp với parseFloat
      expect(updateProductSpy).toHaveBeenCalledWith(mockProduct1.id, expect.objectContaining({ price: 400000 }));
    });

    expect(getProductsSpy).toHaveBeenCalledTimes(2);
  });

  /**
   * Test kịch bản 4: (DELETE) Xóa sản phẩm
   */
  test('nên xóa sản phẩm thành công', async () => {
    getProductsSpy.mockResolvedValue({ data: { content: [mockProduct1] } });
    deleteProductSpy.mockResolvedValue({});

    render(<ProductManagement />);

    await screen.findByText('Sherlock Holmes Toàn Tập');

    fireEvent.click(screen.getByTitle('Xóa'));

    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận Xóa' }));

    await waitFor(() => {
      expect(deleteProductSpy).toHaveBeenCalledWith(mockProduct1.id);
    });

    expect(getProductsSpy).toHaveBeenCalledTimes(2);
  });

  /**
   * Test kịch bản 5: Lỗi Validation (ĐÃ SỬA)
   */
  test('nên hiển thị lỗi validation khi submit form tạo mới rỗng', async () => {
    getProductsSpy.mockResolvedValue({ data: { content: [] } });
    render(<ProductManagement />);

    fireEvent.click(screen.getByText(/thêm mới/i));

    fireEvent.click(screen.getByRole('button', { name: 'Lưu' }));

    // 3. Chờ và kiểm tra lỗi (sử dụng 'within' để sửa lỗi)
    await waitFor(() => {
      const addDialogForm = screen.getByRole('button', { name: 'Lưu' }).closest('form');
      const { getByText } = within(addDialogForm);

      expect(getByText('Tên sản phẩm là bắt buộc')).toBeInTheDocument();
      expect(getByText('Loại sản phẩm là bắt buộc')).toBeInTheDocument();
      expect(getByText('Số lượng phải lớn hơn 0')).toBeInTheDocument();
      expect(getByText('Giá phải lớn hơn 0')).toBeInTheDocument();
    });

    expect(addProductSpy).not.toHaveBeenCalled();
    expect(getProductsSpy).toHaveBeenCalledTimes(1);
  });
});