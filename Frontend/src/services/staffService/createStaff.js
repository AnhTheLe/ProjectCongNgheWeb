import request from '../../utils/httpRequest';
import { createAuthHeader } from '../../utils/createAuthHeader';

export const createStaff = async (data, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.post(`/staffs`, data, { headers });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
