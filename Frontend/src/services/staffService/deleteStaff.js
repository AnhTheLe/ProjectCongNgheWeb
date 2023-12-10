import request from '../../utils/httpRequest';
import { createAuthHeader } from '../../utils/createAuthHeader';

export const deleteStaff = async (id, accessToken) => {
    try {
        const headers = createAuthHeader(accessToken);
        const res = await request.delete(`/staffs/${id}`, { headers });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
