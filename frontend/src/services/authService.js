import axios from 'axios';

// !!! THAY ĐỔI URL NÀY
const API_BASE_URL = 'http://api-cua-ban.com/api';

/**
 * Gọi API để đăng nhập
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise}
 */
export const login = (username, password) => {
    // API đăng nhập không cần token, nên ta gọi axios trực tiếp
    return axios.post(`${API_BASE_URL}/auth/login`, { // Giả định endpoint là /auth/login
        username,
        password,
    });
};