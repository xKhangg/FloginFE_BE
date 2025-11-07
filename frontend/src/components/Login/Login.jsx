import React, { useState } from 'react';
// Import hooks
import { useNavigate } from 'react-router-dom';

// <--- BƯỚC 1: IMPORT TỪ FILE NGOÀI ---
import { validateLoginForm } from '../../utils/loginValidation'; // <--- Tách ra utils
import { login } from '../../services/authService'; // <--- Tách ra service
import styles from './Login.module.css';



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

        // <--- BƯỚC 3: HÀM NÀY GIỜ GỌI BẢN IMPORT ---
        // (Nó sẽ dùng các rule validation phức tạp từ file utils)
        const validationErrors = validateLoginForm({ username, password });
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setIsLoading(true);
        try {
            // <--- BƯỚC 4: HÀM NÀY GIỜ GỌI BẢN IMPORT ---
            // (Nó sẽ gọi hàm mock trong authService.js)
            const response = await login(username, password);
            console.log('Đăng nhập thành công:', response.data);

            // LƯU TOKEN VÀO LOCALSTORAGE
            localStorage.setItem('userToken', response.data.token);

            // CHUYỂN HƯỚNG TỚI TRANG SẢN PHẨM
            navigate('/products');

        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            // Lấy thông báo lỗi từ API giả
            setApiError(error.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
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