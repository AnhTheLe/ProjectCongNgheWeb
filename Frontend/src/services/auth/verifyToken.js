import request from '../../utils/httpRequest';

export const verifyToken = async (token) => {
    const res = await request.post('auth/verify-token', { token });
    return res.data;
};
