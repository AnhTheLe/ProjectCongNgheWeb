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
