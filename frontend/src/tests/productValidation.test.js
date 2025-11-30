// import { validateProduct } from '../utils/productValidation';

// describe('Product Validation Tests', () => {
//   // Test case hợp lệ - Dữ liệu sách
//   test('TC1: Product (Sách) hợp lệ - không có lỗi', () => {
//     const product = {
//       name: 'Sherlock Holmes Toàn Tập',
//       price: 350000,
//       quantity: 50,
//       category: 'Trinh thám',
//       description: 'Tuyển tập các vụ án kinh điển của Sherlock Holmes.'
//     };
//     const errors = validateProduct(product);
//     expect(Object.keys(errors).length).toBe(0);
//   });

//   // === Test Product Name ===
//   test('TC2: Product name rỗng - nên trả về lỗi', () => {
//     const product = { name: '', price: 1000, quantity: 10, category: 'Test' };
//     const errors = validateProduct(product);
//     expect(errors.name).toBe('Tên sản phẩm không được để trống');
//   });

//   test('TC3: Product name quá ngắn - nên trả về lỗi', () => {
//     const product = { name: 'ab', price: 1000, quantity: 10, category: 'Test' };
//     const errors = validateProduct(product);
//     expect(errors.name).toBe('Tên sản phẩm phải có ít nhất 3 ký tự');
//   });

//   test('TC4: Product name quá dài - nên trả về lỗi', () => {
//     const longName = 'a'.repeat(101);
//     const product = { name: longName, price: 1000, quantity: 10, category: 'Test' };
//     const errors = validateProduct(product);
//     expect(errors.name).toBe('Tên sản phẩm không được vượt quá 100 ký tự');
//   });

//   // === Test Price ===
//   test('TC5: Price âm - nên trả về lỗi', () => {
//     const product = { name: 'Một cuốn sách', price: -1000, quantity: 10, category: 'Test' };
//     const errors = validateProduct(product);
//     expect(errors.price).toBe('Giá sản phẩm phải lớn hơn 0');
//   });

//   test('TC6: Price bằng 0 - nên trả về lỗi', () => {
//     const product = { name: 'Một cuốn sách', price: 0, quantity: 10, category: 'Test' };
//     const errors = validateProduct(product);
//     expect(errors.price).toBe('Giá sản phẩm phải lớn hơn 0');
//   });

//   test('TC7: Price quá lớn (boundary) - nên trả về lỗi', () => {
//     const product = { name: 'Một cuốn sách', price: 1000000000, quantity: 10, category: 'Test' };
//     const errors = validateProduct(product);
//     expect(errors.price).toBe('Giá sản phẩm quá lớn (tối đa 999,999,999)');
//   });

//   test('TC8: Price không phải là số - nên trả về lỗi', () => {
//     const product = { name: 'Một cuốn sách', price: 'abc', quantity: 10, category: 'Test' };
//     const errors = validateProduct(product);
//     expect(errors.price).toBe('Giá sản phẩm phải là một con số');
//   });

//   // === Test Quantity ===
//   test('TC9: Quantity âm - nên trả về lỗi', () => {
//     const product = { name: 'Một cuốn sách', price: 1000, quantity: -1, category: 'Test' };
//     const errors = validateProduct(product);
//     expect(errors.quantity).toBe('Số lượng không được nhỏ hơn 0');
//   });

//   test('TC10: Quantity là số thập phân - nên trả về lỗi', () => {
//     const product = { name: 'Một cuốn sách', price: 1000, quantity: 1.5, category: 'Test' };
//     const errors = validateProduct(product);
//     expect(errors.quantity).toBe('Số lượng phải là số nguyên');
//   });

//   test('TC11: Quantity quá lớn (boundary) - nên trả về lỗi', () => {
//     const product = { name: 'Một cuốn sách', price: 1000, quantity: 100000, category: 'Test' };
//     const errors = validateProduct(product);
//     expect(errors.quantity).toBe('Số lượng quá lớn (tối đa 99,999)');
//   });

//   test('TC12: Quantity hợp lệ (boundary 0) - không có lỗi', () => {
//     const product = { name: 'Một cuốn sách', price: 1000, quantity: 0, category: 'Test' };
//     const errors = validateProduct(product);
//     expect(errors.quantity).toBeUndefined(); // Không có lỗi quantity
//   });

//   // === Test Description ===
//   test('TC13: Description quá dài - nên trả về lỗi', () => {
//     const longDesc = 'a'.repeat(501);
//     const product = { name: 'Một cuốn sách', price: 1000, quantity: 10, category: 'Test', description: longDesc };
//     const errors = validateProduct(product);
//     expect(errors.description).toBe('Mô tả không được vượt quá 500 ký tự');
//   });

//   // === Test Category ===
//   test('TC14: Category rỗng - nên trả về lỗi', () => {
//     const product = { name: 'Một cuốn sách', price: 1000, quantity: 10, category: '' };
//     const errors = validateProduct(product);
//     expect(errors.category).toBe('Vui lòng chọn danh mục sản phẩm');
//   });
// });