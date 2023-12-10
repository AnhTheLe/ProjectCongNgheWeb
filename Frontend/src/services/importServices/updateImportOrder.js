import axios from 'axios';
import { createAuthHeader } from '../../utils/createAuthHeader';

const request = axios.create({
    baseURL: 'http://localhost:8080/admin',
});

export const updateImportOrder = async (data, token) => {
    const headers = createAuthHeader(token);
    try {
        const response = await request.post(`/import`, data, {
            headers,
        });

        return response.data;
    } catch (error) {
        return error;
    }
};
