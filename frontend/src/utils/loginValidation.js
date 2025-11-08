// src/utils/loginValidation.js

/**
 * Hàm này dùng để Unit Test theo yêu cầu Câu 2.1.1
 * Kiểm tra username dựa trên rules của PDF (Trang 6)
 * Rules: 3-50 ký tự, chỉ chứa a-z, A-Z, 0-9, _, .
 */
export const validateUsername = (username) => {
  if (!username) return "Tên đăng nhập không được để trống";
  if (username.length < 3) return "Tên đăng nhập phải có ít nhất 3 ký tự";
  if (username.length > 50) return "Tên đăng nhập không được quá 50 ký tự";

  // Regex cho phép a-z, A-Z, 0-9, _, .
  const regex = /^[a-zA-Z0-9_.]+$/;
  if (!regex.test(username)) {
    return "Tên đăng nhập chỉ chứa a-z, A-Z, 0-9, dấu gạch dưới (_) và dấu chấm (.)";
  }

  return ""; // Hợp lệ
};

/**
 * Hàm này dùng để Unit Test theo yêu cầu Câu 2.1.1
 * Kiểm tra password dựa trên rules của PDF (Trang 6)
 * Rules: 6-100 ký tự, phải có cả chữ và số
 */
export const validatePassword = (password) => {
  if (!password) return "Mật khẩu không được để trống";
  if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
  if (password.length > 100) return "Mật khẩu không được quá 100 ký tự";

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLetter || !hasNumber) {
    return "Mật khẩu phải chứa cả chữ và số";
  }

  return ""; // Hợp lệ
};

/**
 * Hàm này để component Login.jsx gọi,
 * nó sẽ tổng hợp lỗi từ 2 hàm con ở trên.
 */
//export const validateLoginForm = ({ username, password }) => {
//    const errors = {};
//
//    const usernameError = validateUsername(username);
//    if (usernameError) errors.username = usernameError;
//
//    const passwordError = validatePassword(password);
//    if (passwordError) errors.password = passwordError;
//
//    return errors;
//};