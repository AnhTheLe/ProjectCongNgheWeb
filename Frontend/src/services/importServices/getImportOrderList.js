import * as request from '../../utils/httpRequest';
import { createAuthHeader } from '../../utils/createAuthHeader';

export const getListImportOrder = async (token) => {

    try {
        const headers = createAuthHeader(token);
        const res = await request.get('/import', {headers});
        return res;
    } catch (error) {
        console.log('getListImportOrder ' + error);
    }
};
