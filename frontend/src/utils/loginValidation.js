
export const validateUsername = (username) => {
  if (!username || username.trim() === '') {
    return "Tên đăng nhập không được để trống";
  }

  if (username.length < 3) return "Tên đăng nhập phải có ít nhất 3 ký tự";
  if (username.length > 50) return "Tên đăng nhập không được quá 50 ký tự";

  const regex = /^[a-zA-Z0-9_.]+$/;
  if (!regex.test(username)) {
    return "Tên đăng nhập chỉ chứa a-z, A-Z, 0-9, dấu gạch dưới (_) và dấu chấm (.)";
  }

  return ""; 
};

export const validatePassword = (password) => {
  if (!password) return "Mật khẩu không được để trống";
  if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
  if (password.length > 100) return "Mật khẩu không được quá 100 ký tự";

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLetter || !hasNumber) {
    return "Mật khẩu phải chứa cả chữ và số";
  }

  return ""; 
};
