import axios from 'axios';
import { createAuthHeader } from '../../utils/createAuthHeader';

const request = axios.create({
    baseURL: 'http://localhost:8080/admin'
});
export const updateBaseProduct = async (baseId, data, token) => {
    const headers = createAuthHeader(token);
    try {
        const response = await request.put(`base-products/${baseId}`, data, {
            headers: headers

        });

        return response.data;
    } catch (error) {
        return error
    }
};
export const createVariant = async (baseId, data, token) => {
    const headers = createAuthHeader(token);
    try {
        const response = await request.post(`base-products/${baseId}/variants`,
            data,
            {
                headers
            });

        return response.data;
    } catch (error) {
        return error
    }
};

export const updateVariant = async (baseId, data, token) => {
    const headers = createAuthHeader(token);
    try {
        const response = await request.put(`base-products/${baseId}/variants`,
            data,
            {
                headers
            });

        return response.data;
    } catch (error) {
        return error
    }
};

export const deleteVariant = async (baseId, variantId, token) => {
    const headers = createAuthHeader(token);
    try {
        const response = await request.delete(`base-products/${baseId}/variants/${variantId}`,
            {
                headers: headers
            }
        );

        return response.data;
    } catch (error) {
        return error
    }
};

export const createAttribute = async (baseId, data, token) => {
    const headers = createAuthHeader(token);
    try {
        const response = await request.post(`base-products/${baseId}/attributes`,
            data,
            {
                headers: headers
            });

        return response.data;
    } catch (error) {
        return error
    }
};

export const updateAttribute = async (baseId, data, token) => {
    const headers = createAuthHeader(token);
    try {
        const response = await request.put(`base-products/${baseId}/attributes`,
            data,
            {
                headers: headers
            });

        return response.data;
    } catch (error) {
        return error
    }
};


export const deleteAttribute = async (baseId, data, token) => {
    // alert(token)
    const headers = createAuthHeader(token);
    try {
        const response = await request.delete(`base-products/${baseId}/attributes`,
            {
                data,
                headers
            }
        );

        return response.data;
    } catch (error) {
        return error;
    }
};


