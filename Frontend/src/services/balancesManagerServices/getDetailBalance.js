import { useContext } from 'react'
import * as request from '../../utils/httpRequest'
import { createAuthHeader } from '../../utils/createAuthHeader'
export const getDetailBalance = async(id, token) => {
    const headers = createAuthHeader(token);
    try {
        const res = await request.get(`/balances/${id}`, {
            headers:headers
        })
        // console.log(res)
        return res
        
    } catch (error) {
        return error;
    }
}