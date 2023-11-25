import * as request from '../utils/httpRequest';
import { createAuthHeader } from '../utils/createAuthHeader';

export const getAllCustomer = async (page = 1, size = 10, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.get(
            '/customer',
            { headers },
            {
                params: {
                    page: page,
                    size: size,
                },
            },
        );
        //console.log(res.data)
        console.log(res);
        return res.data;
    } catch (error) {
        console.log('getAllCustomer' + error);
    }
};

export const getAllCustomerBySpending = async (page = 1, size = 10, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.get(
            `/customer/spending?page=${page}&size=${size}`,
            { headers }
        );
        //console.log(res.data)
        console.log(res);
        return res;
    } catch (error) {
        console.log('getAllCustomer' + error);
    }
};

export const createCustomer = async (formData, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        console.log(formData);
        const res = await request.default.post('/customer', formData, { headers });
        return true;
        //console.log(res.data)
    } catch (error) {
        console.log('createCustomer' + error);
        return false;
    }
};

export const searchCustomer = async (searchTerm, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.get(`/customer/search?searchTerm=${searchTerm}`, { headers });
        //console.log(res.data)
        console.log(res);
        return res.data;
    } catch (error) {
        console.log('searchCustomer ' + error);
    }
};

export const searchCustomerSpending = async (searchTerm, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.get(`/customer/search_spending?searchTerm=${searchTerm}`, { headers });
        //console.log(res.data)
        console.log(res);
        return res.data;
    } catch (error) {
        console.log('searchCustomer ' + error);
    }
};

export const countCustomer = async (accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.get('/customer/count', { headers });
        //console.log(res.data)
        console.log(res);
        return res;
    } catch (error) {
        console.log('countCustomer ' + error);
    }
};

export const getDetailCustomer = async (customerId, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.get(`/customer/${customerId}`, { headers });
        //console.log(res.data)
        console.log(res);
        return res.data;
    } catch (error) {
        console.log('getDetailCustomer ' + error);
    }
};

export const updateCustomer = async (customerId, formData, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.default.put(`/customer/${customerId}`, formData, { headers });
        //console.log(res.data)
        console.log(res);
        return res.data;
    } catch (error) {
        console.log('updateCustomer ' + error);
    }
};

export const deleteCustomerById = async (customerId, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.default.delete(`/customer/${customerId}`, { headers });
        //console.log(res.data)
        console.log(res);
        return res.data;
    } catch (error) {
        console.log('deleteCustomerById ' + error);
    }
};

//Feedback

export const getAllFeedbackByCustomer = async (customerId, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.get(`/customer/${customerId}/feedback`, { headers });
        //console.log(res.data)
        console.log(res);
        return res.data;
    } catch (error) {
        console.log('getAllCustomer' + error);
    }
};

export const getAllFeedback = async (page = 1, size = 10, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.get(
            `/customer/feedback?page=${page}&size=${size}`,
            { headers }
        );
        //console.log(res.data)
        console.log(res);
        return res;
    } catch (error) {
        console.log('getAllFeedback' + error);
    }
};

export const searchFeedback = async (searchTerm, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.get(`/customer/feedback/search?searchTerm=${searchTerm}`, { headers });
        //console.log(res.data)
        console.log(res);
        return res;
    } catch (error) {
        console.log('searchCustomer ' + error);
    }
};


export const createFeedback = async (formData, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        console.log(formData);
        const res = await request.default.post('/customer/feedback', formData, { headers });
        return true;
        //console.log(res.data)
    } catch (error) {
        console.log('createCustomer' + error);
        return false;
    }
};

export const updateFeedback = async (feedbackId, formData, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.default.put(`/customer/feedback/${feedbackId}`, formData, { headers });
        //console.log(res.data)
        console.log(res);
        return res.data;
    } catch (error) {
        console.log('updateFeedback ' + error);
    }
};

export const deleteFeedback = async (feedbackId, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.default.delete(`/customer/feedback/${feedbackId}`, { headers });
        //console.log(res.data)
        console.log(res);
        return res.data;
    } catch (error) {
        console.log('deleteFeedbackById ' + error);
    }
};

//Order
export const getListOrderByCustomer = async (customerId, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.get(`/customer/${customerId}/order`, { headers });
        //console.log(res.data)
        console.log(res);
        return res.data;
    } catch (error) {
        console.log('getAllCustomer' + error);
    }
};
