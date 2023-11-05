import request from '../../utils/httpRequest';

export const login = async ({ phone, password }) => {
    try {
        const res = await request.post('auth/login', { phone, password });

        return res.data;
    } catch (err) {
        console.log(err);
    }
};
