import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// 1. Tạo axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 2. Thêm "Interceptor" để tự động gắn Token vào mọi request

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Gọi API lấy danh sách
export const getAllCategories = () => {
    return apiClient.get('/categories');
};