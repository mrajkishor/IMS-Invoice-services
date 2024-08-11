export const API_BASE_URL = 'https://s67k4h7ckb.execute-api.ap-south-1.amazonaws.com/Prod';

export const AUTH_LOGIN = `${API_BASE_URL}/auth/login`;
export const AUTH_LOGOUT = `${API_BASE_URL}/auth/logout`;
export const AUTH_REFRESH = `${API_BASE_URL}/auth/refresh`;

export const AUTH_REGISTER = `${API_BASE_URL}/users`;
export const GET_USER = (userId: string) => `${API_BASE_URL}/users/${userId}`;
export const UPDATE_USER = (userId: string) => `${API_BASE_URL}/users/${userId}`;
export const DELETE_USER = (userId: string) => `${API_BASE_URL}/users/${userId}`;

export const CREATE_SHOP = `${API_BASE_URL}/shops`;
export const GET_SHOP = (shopId: string) => `${API_BASE_URL}/shops/${shopId}`;
export const UPDATE_SHOP = (shopId: string) => `${API_BASE_URL}/shops/${shopId}`;
export const DELETE_SHOP = (shopId: string) => `${API_BASE_URL}/shops/${shopId}`;

export const CREATE_INVOICE = `${API_BASE_URL}/invoices`;
export const GET_INVOICE = (invoiceId: string) => `${API_BASE_URL}/invoices/${invoiceId}`;
export const UPDATE_INVOICE = (invoiceId: string) => `${API_BASE_URL}/invoices/${invoiceId}`;
export const DELETE_INVOICE = (invoiceId: string) => `${API_BASE_URL}/invoices/${invoiceId}`;

export const GET_SHOP_HISTORY = (shopId: string) => `${API_BASE_URL}/shops/${shopId}/history`;

export const INVOICE_PROD_URL = 'https://my-app-three-zeta-98.vercel.app';
