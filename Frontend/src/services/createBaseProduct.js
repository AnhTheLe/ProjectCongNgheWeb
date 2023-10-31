import request from '../utils/httpRequest';

export const createBaseProduct = async (formData) => {
    try {
        const res = await request.post('/base-products', formData);
        return true;
        //console.log(res.data)
    } catch (error) {
        console.log('createBaseProduct' + error);
        return false;
    }
};
