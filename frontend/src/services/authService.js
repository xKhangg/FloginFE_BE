

import axios from 'axios';
const API_BASE_URL = 'http://localhost:8080/';

const apiClient = axios.create({
    baseURL: API_BASE_URL
});

export const login = (username, password) => {
    return apiClient.post('/api/auth/login', { username, password });
};