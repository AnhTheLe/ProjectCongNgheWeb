import request from '../../utils/httpRequest';
import { createAuthHeader } from '../../utils/createAuthHeader';

export const getStaffDetail = async (id, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.get(`staffs/${id}`, { headers });

        return res.data;
    } catch (err) {
        console.log(err);
    }
};
