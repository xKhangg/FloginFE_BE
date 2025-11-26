// --- BẮT ĐẦU PHẦN MOCK API ---

// // 1. Giả lập CSDL
// let mockProducts = [
//     {
//         id: 1,
//         name: 'Sherlock Holmes Toàn Tập',
//         price: 350000,
//         quantity: 50,
//         description: 'Tuyển tập các vụ án kinh điển của Sherlock Holmes.',
//         categoryName: 'Trinh thám' // Dùng categoryName như trong component ProductManagement
//     },
//     {
//         id: 2,
//         name: 'Án Mạng Trên Sông Nile',
//         price: 120000,
//         quantity: 30,
//         description: 'Tác giả: Agatha Christie. Một vụ án bí ẩn trên du thuyền.',
//         categoryName: 'Trinh thám'
//     },
//     {
//         id: 3,
//         name: 'Dế Mèn Phiêu Lưu Ký',
//         price: 80000,
//         quantity: 100,
//         description: 'Tác giả: Tô Hoài. Phiên bản có tranh minh họa màu.',
//         categoryName: 'Thiếu nhi'
//     },
//     {
//         id: 4,
//         name: 'Lược Sử Vạn Vật',
//         price: 250000,
//         quantity: 40,
//         description: 'Tác giả: Bill Bryson. Giải thích khoa học một cách hài hước.',
//         categoryName: 'Khoa học'
//     },
//     {
//         id: 5,
//         name: 'Vũ Trụ Trong Vỏ Hạt Dẻ',
//         price: 180000,
//         quantity: 25,
//         description: 'Tác giả: Stephen Hawking. Khám phá vật lý lý thuyết.',
//         categoryName: 'Khoa học'
//     }
// ];

// // Biến giả lập ID tự tăng
// let nextId = 6;

// // 2. Hàm giả lập độ trễ mạng (giống authService)
// const simulateNetwork = (data, delay = 300) => {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             // Bọc data trong { data: ... } để giả lập cấu trúc của axios
//             resolve({ data: data });
//         }, delay);
//     });
// };

// // 3. Các hàm API giả (mock)

// // (READ) Lấy tất cả sản phẩm
// export const getProducts = () => {
//     console.log("Đã gọi API giả (mock): getProducts");
//     // Giả lập cấu trúc trả về của Spring Pageable (giống component của bạn)
//     const response = {
//         content: mockProducts
//     };
//     return simulateNetwork(response);
// };

// // (CREATE) Thêm sản phẩm mới
// export const addProduct = (productData) => {
//     console.log("Đã gọi API giả (mock): addProduct", productData);

//     const newProduct = {
//         ...productData,
//         id: nextId++, // Gán ID mới
//     };

//     mockProducts.push(newProduct);
//     return simulateNetwork(newProduct); // Trả về sản phẩm vừa tạo
// };

// // (UPDATE) Cập nhật sản phẩm
// export const updateProduct = (id, productData) => {
//     console.log("Đã gọi API giả (mock): updateProduct", id, productData);

//     // Tìm index của sản phẩm
//     const productIndex = mockProducts.findIndex(p => p.id === id);

//     if (productIndex !== -1) {
//         // Cập nhật sản phẩm
//         mockProducts[productIndex] = {
//             ...mockProducts[productIndex], // Giữ lại ID cũ
//             ...productData // Ghi đè bằng data mới
//         };
//         return simulateNetwork(mockProducts[productIndex]); // Trả về sản phẩm đã cập nhật
//     } else {
//         // Trả về lỗi nếu không tìm thấy
//         return Promise.reject(new Error("Không tìm thấy sản phẩm để cập nhật."));
//     }
// };

// // (DELETE) Xóa sản phẩm
// export const deleteProduct = (id) => {
//     console.log("Đã gọi API giả (mock): deleteProduct", id);

//     const productIndex = mockProducts.findIndex(p => p.id === id);

//     if (productIndex !== -1) {
//         // Xóa sản phẩm khỏi mảng
//         mockProducts.splice(productIndex, 1);
//         return simulateNetwork({}); // Trả về thành công (không cần nội dung)
//     } else {
//          return Promise.reject(new Error("Không tìm thấy sản phẩm để xóa."));
//     }
// };


// --- HẾT PHẦN MOCK API ---

// ==================================================
// --- PHẦN API THẬT  ---
// ==================================================
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL
});

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

export const getProducts = () => apiClient.get('/products');
export const addProduct = (productData) => apiClient.post('/products', productData);
export const updateProduct = (id, productData) => apiClient.put(`/products/${id}`, productData);
export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);