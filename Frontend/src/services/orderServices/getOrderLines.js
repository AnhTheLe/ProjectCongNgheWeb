import request from '../../utils/httpRequest';
import { createAuthHeader } from '../../utils/createAuthHeader';

export const getOrderLines = async (orderId, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.get(`orders/${orderId}/order_lines`, { headers });

        return res.data;
    } catch (err) {
        console.log(err);
    }
};
