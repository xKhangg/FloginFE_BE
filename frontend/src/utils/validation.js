// src/utils/validation.js

/**
 * Kiểm tra form đăng nhập
 * @param {object} data - { email, password }
 * @returns {object} - Một đối tượng chứa lỗi, ví dụ: { email: 'Email là bắt buộc' }
 */
export const validateLoginForm = ({ email, password }) => {
    const errors = {};

    if (!email) {
        errors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        // Regex đơn giản để kiểm tra email
        errors.email = 'Email không hợp lệ';
    }

    if (!password) {
        errors.password = 'Mật khẩu không được để trống';
    } else if (password.length < 6) {
        // Ví dụ: yêu cầu mật khẩu tối thiểu 6 ký tự
        errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    return errors;
};

// Bạn có thể thêm các hàm validate khác ở đây (ví dụ: validateProductForm)