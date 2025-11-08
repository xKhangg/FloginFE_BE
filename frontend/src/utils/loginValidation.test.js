import { validateUsername, validatePassword } from './loginValidation';

// Tests cho validateUsername [cite: 139]
describe('Login Validation Tests - validateUsername', () => {

  // Test username rỗng [cite: 140]
  test('TC1: Username rỗng - nên trả về lỗi', () => {
    expect(validateUsername('')).toBe('Tên đăng nhập không được để trống');
    expect(validateUsername('   ')).toBe('Tên đăng nhập không được để trống');
  });

  // Test username quá ngắn [cite: 141]
  test('TC2: Username quá ngắn - nên trả về lỗi', () => {
    expect(validateUsername('ab')).toBe('Tên đăng nhập phải có ít nhất 3 ký tự');
  });

  // Test username quá dài [cite: 141]
  test('TC3: Username quá dài - nên trả về lỗi', () => {
    const longUsername = 'a'.repeat(51); // 51 ký tự
    expect(validateUsername(longUsername)).toBe('Tên đăng nhập không được vượt quá 50 ký tự');
  });

  // Test ký tự đặc biệt không hợp lệ [cite: 142]
  test('TC4: Username chứa ký tự đặc biệt - nên trả về lỗi', () => {
    expect(validateUsername('user!')).toBe('Tên đăng nhập chỉ được chứa chữ cái và số');
    expect(validateUsername('user@name')).toBe('Tên đăng nhập chỉ được chứa chữ cái và số');
    expect(validateUsername('user name')).toBe('Tên đăng nhập chỉ được chứa chữ cái và số');
  });

  // Test username hợp lệ [cite: 143]
  test('TC5: Username hợp lệ - không có lỗi (chuỗi rỗng)', () => {
    expect(validateUsername('user123')).toBe('');
    expect(validateUsername('abc')).toBe(''); // Boundary min
    expect(validateUsername('a'.repeat(50))).toBe(''); // Boundary max
  });
});

// Tests cho validatePassword [cite: 144]
describe('Login Validation Tests - validatePassword', () => {

  // Test password rỗng [cite: 145]
  test('TC6: Password rỗng - nên trả về lỗi', () => {
    expect(validatePassword('')).toBe('Mật khẩu không được để trống');
  });

  // Test password quá ngắn [cite: 146]
  test('TC7: Password quá ngắn - nên trả về lỗi', () => {
    expect(validatePassword('a1')).toBe('Mật khẩu phải có ít nhất 6 ký tự');
    expect(validatePassword('12345')).toBe('Mật khẩu phải có ít nhất 6 ký tự');
  });

  // Test password quá dài [cite: 146]
  test('TC8: Password quá dài - nên trả về lỗi', () => {
    const longPassword = 'a'.repeat(100) + '1'; // 101 ký tự
    expect(validatePassword(longPassword)).toBe('Mật khẩu không được vượt quá 100 ký tự');
  });

  // Test password không có chữ hoặc số [cite: 147]
  test('TC9: Password chỉ có chữ (thiếu số) - nên trả về lỗi', () => {
    expect(validatePassword('password')).toBe('Mật khẩu phải chứa cả chữ cái và số');
  });

  test('TC10: Password chỉ có số (thiếu chữ) - nên trả về lỗi', () => {
    expect(validatePassword('12345678')).toBe('Mật khẩu phải chứa cả chữ cái và số');
  });

  // Test password hợp lệ [cite: 148]
  test('TC11: Password hợp lệ - không có lỗi (chuỗi rỗng)', () => {
    expect(validatePassword('Pass123')).toBe('');
    expect(validatePassword('abcdefg1')).toBe('');
    expect(validatePassword('12345abc')).toBe('');
    expect(validatePassword('a'.repeat(99) + '1')).toBe(''); // Boundary max
  });
});