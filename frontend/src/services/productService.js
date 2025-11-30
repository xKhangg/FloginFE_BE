
import axios from 'axios';
const API_BASE_URL = 'http://localhost:8080/api';
const apiClient = axios.create({
    baseURL: API_BASE_URL
});

// Interceptor để tự động gắn Token vào header
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

/**
 * Lấy danh sách sản phẩm có hỗ trợ Phân trang, Lọc loại và Tìm kiếm
 * @param {number} page - Trang hiện tại (0, 1, 2...)
 * @param {number|string|null} categoryId - ID loại sản phẩm (hoặc null)
 * @param {string} search - Từ khóa tìm kiếm
 * @param {number} size - Số lượng item trên 1 trang (Mặc định là 5)
 */
export const getProducts = (page = 0, categoryId = null, search = '', size = 5) => {
    // Sử dụng params object để axios tự xử lý việc nối chuỗi query string
    const params = {
        page: page,
        size: size
    };

    // Nếu có categoryId hợp lệ thì thêm vào params
    if (categoryId && categoryId !== 'All') {
        params.categoryId = categoryId;
    }

    // Nếu có từ khóa tìm kiếm thì thêm vào params (gửi key là 'name')
    if (search) {
        params.name = search; 
    }

    return apiClient.get('/products', { params: params });
};

export const addProduct = (productData) => apiClient.post('/products', productData);

export const updateProduct = (id, productData) => apiClient.put(`/products/${id}`, productData);

export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);