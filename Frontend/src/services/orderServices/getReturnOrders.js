import request from '../../utils/httpRequest';
import { createAuthHeader } from '../../utils/createAuthHeader';

export const getReturnOrders = async (page, size, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.get(`return_orders?page=${page}&size=${size}`, { headers });

        return res.data;
    } catch (err) {
        console.log(err);
    }
};
