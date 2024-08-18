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