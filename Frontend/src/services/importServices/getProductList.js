import * as request from '../../utils/httpRequest';
import { createAuthHeader } from '../../utils/createAuthHeader';

export const getListProduct = async (token) => {

    try {
        const headers = createAuthHeader(token);
        const res = await request.get('base-products/variants', {headers});
        return res;
    } catch (error) {
        console.log('getListProduct ' + error);
    }
};