import React, { useState } from 'react';
// Import hooks
import { useNavigate } from 'react-router-dom';

// import { validateLoginForm } from '../utils/validation'; 
// import { login } from '../services/authService'; 
import styles from './Login.module.css';

// --- Logic giả lập (Giữ nguyên) ---
const validateLoginForm = ({ username, password }) => {
    const errors = {};
    if (!username) errors.username = "Tên đăng nhập là bắt buộc";
    if (!password) errors.password = "Mật khẩu là bắt buộc";
    return errors;
};
const login = (username, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (username === "admin" && password === "123") {
                resolve({ data: { token: "fake-admin-token-123" } });
            } else {
                reject(new Error("Lỗi đăng nhập"));
            }
        }, 500);
    });
};
// --- Hết logic giả lập ---


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Khởi tạo navigate
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setApiError('');

        const validationErrors = validateLoginForm({ username, password });
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setIsLoading(true);
        try {
            // Gọi API
            const response = await login(username, password);
            console.log('Đăng nhập thành công:', response.data);

            // LƯU TOKEN VÀO LOCALSTORAGE
            localStorage.setItem('userToken', response.data.token);

            // CHUYỂN HƯỚNG TỚI TRANG SẢN PHẨM
            navigate('/products');

        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            setApiError('Tên đăng nhập hoặc mật khẩu không chính xác.');
        }
        setIsLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <h1 className={styles.title}>Đăng nhập</h1>

                <form onSubmit={handleSubmit} noValidate className={styles.form}>

                    {apiError && <div className={styles.apiError}>{apiError}</div>}

                    {/* --- Group Tên đăng nhập --- */}
                    <div className={styles.formGroup}>
                        <label htmlFor="username" className={styles.label}>
                            Tên đăng nhập <span className={styles.requiredStar}>*</span>
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
                        />
                        {errors.username && <span className={styles.helperText}>{errors.username}</span>}
                    </div>

                    {/* --- Group Mật khẩu --- */}
                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>
                            Mật khẩu <span className={styles.requiredStar}>*</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                        />
                        {errors.password && <span className={styles.helperText}>{errors.password}</span>}
                    </div>

                    {/* --- Nút Đăng nhập --- */}
                    <button
                        type="submit"
                        className={styles.button}
                        disabled={isLoading}
                    >
                        {isLoading ? <div className={styles.loader}></div> : 'Đăng nhập'}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default Login;