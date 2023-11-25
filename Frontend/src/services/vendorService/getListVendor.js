import * as request from '../../utils/httpRequest';
import { createAuthHeader } from '../../utils/createAuthHeader';

export const getListVendor = async (token) => {

    try {
        const headers = createAuthHeader(token);
        const res = await request.get('/vendor', {headers});
        return res.data;
    } catch (error) {
        console.log('getListVendor ' + error);
    }
};
