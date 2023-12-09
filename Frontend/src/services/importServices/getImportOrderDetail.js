import * as request from '../../utils/httpRequest';
import { createAuthHeader } from '../../utils/createAuthHeader';

export const getImportOrderDetail = async (orderId, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.get(`/import/${orderId}`, { headers });
        return res;
    } catch (err) {
        console.log(err);
    }
};

