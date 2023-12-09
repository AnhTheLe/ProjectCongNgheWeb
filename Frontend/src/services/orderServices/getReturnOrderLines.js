import request from '../../utils/httpRequest';
import { createAuthHeader } from '../../utils/createAuthHeader';

export const getReturnOrderLines = async (orderId, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.get(`return_orders/${orderId}/return_order_lines`, { headers });

        return res.data;
    } catch (err) {
        console.log(err);
    }
};
