import { validateUsername, validatePassword } from '../utils/loginValidation';


describe('Login Validation Tests - validateUsername', () => {


  test('TC1: Username rỗng - nên trả về lỗi', () => {
    expect(validateUsername('')).toBe('Tên đăng nhập không được để trống');
    expect(validateUsername('   ')).toBe('Tên đăng nhập không được để trống');
  });

  test('TC2: Username quá ngắn - nên trả về lỗi', () => {
    expect(validateUsername('ab')).toBe('Tên đăng nhập phải có ít nhất 3 ký tự');
  });

  test('TC3: Username quá dài - nên trả về lỗi', () => {
    const longUsername = 'a'.repeat(51); // 51 ký tự

    expect(validateUsername(longUsername)).toBe('Tên đăng nhập không được quá 50 ký tự');
  });

  test('TC4: Username chứa ký tự đặc biệt - nên trả về lỗi', () => {

    const expectedError = "Tên đăng nhập chỉ chứa a-z, A-Z, 0-9, dấu gạch dưới (_) và dấu chấm (.)";
    expect(validateUsername('user!')).toBe(expectedError);
    expect(validateUsername('user@name')).toBe(expectedError);
    expect(validateUsername('user name')).toBe(expectedError);
  });

  test('TC5: Username hợp lệ - không có lỗi (chuỗi rỗng)', () => {
    expect(validateUsername('user123')).toBe('');
    expect(validateUsername('abc')).toBe('');
    expect(validateUsername('a'.repeat(50))).toBe('');
    expect(validateUsername('user_name')).toBe('');
    expect(validateUsername('user.name')).toBe('');
  });
});

// Tests cho validatePassword
describe('Login Validation Tests - validatePassword', () => {

  test('TC6: Password rỗng - nên trả về lỗi', () => {
    expect(validatePassword('')).toBe('Mật khẩu không được để trống');
  });

  test('TC7: Password quá ngắn - nên trả về lỗi', () => {
    expect(validatePassword('a1')).toBe('Mật khẩu phải có ít nhất 6 ký tự');
    expect(validatePassword('12345')).toBe('Mật khẩu phải có ít nhất 6 ký tự');
  });

  test('TC8: Password quá dài - nên trả về lỗi', () => {
    const longPassword = 'a'.repeat(100) + '1'; // 101 ký tự
    expect(validatePassword(longPassword)).toBe('Mật khẩu không được quá 100 ký tự');
  });

  test('TC9: Password chỉ có chữ (thiếu số) - nên trả về lỗi', () => {
    expect(validatePassword('password')).toBe('Mật khẩu phải chứa cả chữ và số');
  });

  test('TC10: Password chỉ có số (thiếu chữ) - nên trả về lỗi', () => {
    expect(validatePassword('12345678')).toBe('Mật khẩu phải chứa cả chữ và số');
  });

  test('TC11: Password hợp lệ - không có lỗi (chuỗi rỗng)', () => {
    expect(validatePassword('Pass123')).toBe('');
    expect(validatePassword('abcdefg1')).toBe('');
    expect(validatePassword('12345abc')).toBe('');
    expect(validatePassword('a'.repeat(99) + '1')).toBe('');
  });
});