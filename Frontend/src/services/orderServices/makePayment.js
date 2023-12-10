import request from '../../utils/httpRequest';
import { createAuthHeader } from '../../utils/createAuthHeader';

export const makePayment = async (returnOrderId, swapOrderId, paymentMethod, createdAt, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        console.log(createdAt);
        const res = await request.post(
            '/payment/orders',
            { returnOrderId, swapOrderId, paymentMethod, createdAt },
            { headers },
        );
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
