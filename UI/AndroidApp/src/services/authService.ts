import api from './api';
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_REFRESH, AUTH_REGISTER } from '../constants';

export const login = async (identifier: string, password: string) => {
    const payload = { identifier: identifier, password };

    const response = await api.post(AUTH_LOGIN, payload);
    return response.data;
};

export const logout = async () => {
    const response = await api.post(AUTH_LOGOUT);
    return response.data;
};

export const refresh = async (refreshToken: string) => {
    const response = await api.post(AUTH_REFRESH, { refreshToken });
    return response.data;
};

export const register = async (email: string, username: string, password: string) => {
    const response = await api.post(AUTH_REGISTER, { email, username, password });
    return response.data;
};

export const refreshTokenService = async (refreshToken: string) => {
    try {
        const response = await api.post(AUTH_REFRESH, { refreshToken });
        if (!response.data.refreshToken) {
            throw new Error('API did not return a refreshToken');
        }
        return response.data; // Assuming the response contains the new accessToken and refreshToken
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error; // Re-throw the error to handle it in the calling code
    }
};
