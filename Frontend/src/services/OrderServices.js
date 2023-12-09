import request from '../utils/httpRequest';
import { createAuthHeader } from '../utils/createAuthHeader';

export const createOrder = async (formData, accessToken) => {
    try {
        // console.log(formData);
        const headers = createAuthHeader(accessToken);
        const res = await request.post('/orders', formData, { headers });
        return true;
        //console.log(res.data)
    } catch (error) {
        console.log('createOrder' + error);
        return false;
    }
};

export const statisticalByTime = async (startDate, endDate, accessToken) => {
    try {
        // console.log(formData);
        const headers = createAuthHeader(accessToken);
        const res = await request.get(`/orders/statistical?startDate=${startDate}&endDate=${endDate}`, { headers });
        return res.data;
        //console.log(res.data)
    } catch (error) {
        console.log('createOrder' + error);
        return false;
    }
};

export const statisticalListByTime = async (startDate, endDate, accessToken) => {
    try {
        // console.log(formData);
        const headers = createAuthHeader(accessToken);
        const res = await request.get(`/orders/statistical/list?startDate=${startDate}&endDate=${endDate}`, { headers });
        return res.data;
        //console.log(res.data)
    } catch (error) {
        console.log('createOrder' + error);
        return false;
    }
};

export const topOrder = async (startDate, endDate, type, accessToken) => {
    try {
        // console.log(formData);
        const headers = createAuthHeader(accessToken);
        const res = await request.get(`/orders/top_sale?startDate=${startDate}&endDate=${endDate}&type=${type}`, { headers });
        return res.data;
        //console.log(res.data)
    } catch (error) {
        console.log('createOrder' + error);
        return false;
    }
};

export const topCustomer = async (startDate, endDate, type, accessToken) => {
    try {
        // console.log(formData);
        const headers = createAuthHeader(accessToken);
        const res = await request.get(`/orders/top_customer?startDate=${startDate}&endDate=${endDate}&type=${type}`, { headers });
        return res.data;
        //console.log(res.data)
    } catch (error) {
        console.log('createOrder' + error);
        return false;
    }
};

