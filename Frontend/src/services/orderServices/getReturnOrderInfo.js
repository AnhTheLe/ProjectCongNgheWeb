import request from '../../utils/httpRequest';
import { createAuthHeader } from '../../utils/createAuthHeader';

export const getReturnOrderInfo = async (orderId, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.get(`return_orders/${orderId}`, { headers });

        return res.data;
    } catch (err) {
        console.log(err);
    }
};
