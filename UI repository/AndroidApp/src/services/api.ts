import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants';

// Create an axios instance
const api = axios.create({
    baseURL: API_BASE_URL, // Replace with your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding the token to headers
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { token: refreshToken });
                    const newAccessToken = response.data.accessToken;
                    await AsyncStorage.setItem('accessToken', newAccessToken);
                    api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (err) {
                    return Promise.reject(err);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
