import request from '../../utils/httpRequest';
import { createAuthHeader } from '../../utils/createAuthHeader';

export const createReturnOrder = async (data, baseOrderId, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.post(`/return_orders/create?order_id=${baseOrderId}`, data, { headers });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
