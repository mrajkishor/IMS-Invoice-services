import api from './api';
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_REFRESH } from '../constants';

export const login = async (email: string, password: string) => {
    const response = await api.post(AUTH_LOGIN, { email, password });
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
