import axios from 'axios';

// !!! THAY ĐỔI URL NÀY
const API_BASE_URL = 'http://localhost:8080/api';

// Tạo một "instance" của axios
const apiClient = axios.create({
    baseURL: API_BASE_URL
});

// Đây là phần "intercept" (chặn)
// Nó sẽ tự động thêm token vào header của MỌI request
apiClient.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage
        const token = localStorage.getItem('userToken');
        if (token) {
            // Thêm vào header
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Bây giờ tất cả các hàm đều dùng 'apiClient' đã có token

// (READ) Lấy tất cả sản phẩm
export const getProducts = () => apiClient.get('/products');

// (CREATE) Thêm sản phẩm mới
export const addProduct = (productData) => apiClient.post('/products', productData);

// (UPDATE) Cập nhật sản phẩm
export const updateProduct = (id, productData) => apiClient.put(`/products/${id}`, productData);

// (DELETE) Xóa sản phẩm
export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);