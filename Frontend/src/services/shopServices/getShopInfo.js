import axios from 'axios';
import { createAuthHeader } from '../../utils/createAuthHeader';

const request = axios.create({
    baseURL: 'http://localhost:8080/admin',
});

export const getShopInfo = async (token) => {
    const headers = createAuthHeader(token);
    try {
        const response = await request.get('shop', { headers });
        return response.data;
    } catch (error) {
        return false;
    }
};
