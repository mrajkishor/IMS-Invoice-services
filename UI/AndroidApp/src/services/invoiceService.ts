import api from './api';

export const fetchInvoices = async (shopId: string) => {
    const response = await api.get(`/shops/${shopId}/invoices`);
    return response.data.invoices;
};
