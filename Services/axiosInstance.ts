import axios from 'axios';
import { API_CONFIG } from '../apiConfig';

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// THÊM: Interceptor để log lỗi tập trung
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu server trả về lỗi, nó sẽ nhảy vào đây
    console.error("Lỗi Response:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;