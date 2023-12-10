import request from '../../utils/httpRequest';
import { createAuthHeader } from '../../utils/createAuthHeader';

export const updatePassword = async (id, data, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.put(`/staffs/${id}/password`, data, { headers });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
