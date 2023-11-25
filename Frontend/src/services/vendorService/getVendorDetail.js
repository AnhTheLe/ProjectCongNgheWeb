import * as request from '../../utils/httpRequest';
import { createAuthHeader } from '../../utils/createAuthHeader';

export const getVendorDetail = async (vendorId, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.get(`/vendor/${vendorId}`, { headers });
        console.log(res);
        return res;
    } catch (err) {
        console.log(err);
    }
};
