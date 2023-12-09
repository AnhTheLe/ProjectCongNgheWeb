import request from '../../utils/httpRequest';
import { createAuthHeader } from '../../utils/createAuthHeader';

export const updateStaff = async (id, data, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.put(`/staffs/${id}`, data, { headers });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
