import axios from 'axios';
import { User } from '../store/types';


export const fetchUser = async (userId: string): Promise<User> => {
    const response = await axios.get(`/users/${userId}`);
    return response.data;
};

export const updateUser = async (userId: string, userDetails: Partial<User>): Promise<User> => {
    const response = await axios.put(`/users/${userId}`, userDetails);
    return response.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
    await axios.delete(`/users/${userId}`);
};
