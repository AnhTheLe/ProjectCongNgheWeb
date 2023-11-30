import axios from 'axios';
import { createAuthHeader } from '../../utils/createAuthHeader';

const request = axios.create({
    baseURL: 'http://localhost:8080/admin'
  });
export const deleteProduct = async (baseId, token) => {
    const headers = createAuthHeader(token);
    try {
        const response = await request.delete(`base-products/${baseId}`, {
            headers:headers
        });

        return response.data;
    } catch (error) {
        return error
    }
};
