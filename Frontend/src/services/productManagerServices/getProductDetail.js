import { createAuthHeader } from '../../utils/createAuthHeader';
import * as request from '../../utils/httpRequest'
export const getProductDetail = async(baseId, token) => {
    const headers = createAuthHeader(token);
    try {
        const res = await request.get(`base-products/${baseId}`, {
            headers:headers
        })
        // console.log(res)
        return res.data

    } catch (error) {
        console.log('getProductDetail ' + error)
    }
}