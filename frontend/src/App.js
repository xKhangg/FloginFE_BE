import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';


import Login from './components/Login/Login';
import ProductManagement from './components/ProductManagement/ProductManagement';

import styles from './App.module.css';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Kiểm tra xem người dùng đã đăng nhập chưa 
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
            {/* 2. Nút "Đăng xuất"  */}
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