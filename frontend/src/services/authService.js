// src/services/authService.js

// --- BẮT ĐẦU PHẦN MOCK API ---


// // Hàm giả lập độ trễ mạng
// const simulateNetwork = (data, delay = 300) => {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             // Bọc data trong { data: ... } để giả lập cấu trúc của axios
//             resolve({ data: data });
//         }, delay);
//     });
// };

// // Hàm giả lập lỗi
// const simulateError = (message, delay = 300) => {
//      return new Promise((_, reject) => {
//         setTimeout(() => {
//             reject(new Error(message));
//         }, delay);
//     });
// }

// /**
//  * Giả lập API đăng nhập.
//  * Dùng tài khoản test từ PDF (Trang 7): testuser / Test123
//  */
// export const login = (username, password) => {
//     console.log("Đã gọi API giả (mock): login", { username, password });

//     if (username === "testuser" && password === "Test123") {
//         const successResponse = {
//             token: "mock-admin-token-xyz789",
//             user: { username: "testuser" }
//         };
//         // Trả về thành công
//         return simulateNetwork(successResponse);
//     }

//     // Trả về lỗi
//     return simulateError("Tên đăng nhập hoặc mật khẩu không chính xác.");
// };


// --- HẾT PHẦN MOCK API ---

// ==================================================
// --- PHẦN API THẬT (ĐỂ DÙNG SAU NÀY) ---
// ==================================================

import axios from 'axios';
const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL
});

export const login = (username, password) => {
    return apiClient.post('/auth/login', { username, password });
};