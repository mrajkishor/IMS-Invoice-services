import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
    baseURL: API_BASE_URL, // Replace with your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
