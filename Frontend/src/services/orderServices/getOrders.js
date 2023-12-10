import request from '../../utils/httpRequest';
import { createAuthHeader } from '../../utils/createAuthHeader';

export const getOrders = async (page, size, search, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.get(`orders?page=${page}&size=${size}&search=${search}`, { headers });

        return res.data;
    } catch (err) {
        console.log(err);
    }
};
