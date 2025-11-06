import React from 'react';
// Import hooks và components cần thiết từ react-router-dom
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

// Sửa đường dẫn: 'Components' -> 'components' (chữ thường)
import Login from './Components/Login';
import ProductManagement from './Components/ProductManagement';

// Import file CSS Module mới cho App
import styles from './App.module.css';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Kiểm tra xem người dùng đã đăng nhập chưa (giả sử token được lưu)
  // Logic này sẽ hoạt động sau khi chúng ta cập nhật file Login.jsx
  const isLoggedIn = !!localStorage.getItem('userToken');

  // Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('userToken'); // Xóa token
    navigate('/login'); // Chuyển về trang login
  };

  // Quyết định có hiển thị navbar hay không
  // Chỉ hiển thị khi KHÔNG ở trang /login
  const showNavbar = location.pathname !== '/login';

  return (
    <div className={styles.appContainer}>
      {/* 1. Chỉ hiển thị navbar khi showNavbar là true */}
      {showNavbar && (
        <nav className={styles.navbar}>
          <div className={styles.navTitle}>
            HỆ THỐNG QUẢN LÝ SẢN PHẨM
          </div>
          <div className={styles.navActions}>
            {/* 2. Nút "Đăng xuất" thay vì "Đăng nhập" */}
            <button onClick={handleLogout} className={styles.logoutButton}>
              Đăng xuất
            </button>
          </div>
        </nav>
      )}

      {/* 3. Khu vực nội dung chính */}
      <main className={styles.mainContent}>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* 4. Bảo vệ route /products */}
          <Route
            path="/products"
            element={
              isLoggedIn ? <ProductManagement /> : <Navigate to="/login" replace />
            }
          />

          {/* 5. Route mặc định: 
              Nếu đã login, vào /products. 
              Nếu chưa, vào /login.
          */}
          <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to="/products" replace /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;