import * as request from '../utils/httpRequest';
import { createAuthHeader } from '../utils/createAuthHeader';

export const getAllVariants = async (page = 1, size = 10, accessToken) => {
    // console.log('accessToken', accessToken);

    try {
        const headers = createAuthHeader(accessToken);
        // console.log('headers', headers);
        const res = await request.get(`/base-products/variants?page=${page}&size=${size}`, { headers });

        //console.log(res.data)
        console.log(res);
        return res;
    } catch (error) {
        console.log('getCategory ' + error);
    }
};

export const searchVariants = async (keyword, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.get(`/base-products/variants/search?keyword=${keyword}`, { headers });
        return res.data;
    } catch (error) {
        console.log('searchVariants ' + error);
    }
};
