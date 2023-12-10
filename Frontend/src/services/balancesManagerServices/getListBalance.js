import { useContext } from 'react'
import * as request from '../../utils/httpRequest'
import { createAuthHeader } from '../../utils/createAuthHeader'
export const getListBalance = async(param, token) => {
    const headers = createAuthHeader(token);
    try {
        const res = await request.get('/balances', {
            params: {
                page: param.page+1,
                size:param.pageSize
            },
            headers:headers
        })
        // console.log(res)
        return res
        
    } catch (error) {
        return error;
    }
}

export const searchBalance = async(keyword, token) => {
    const headers = createAuthHeader(token);
    try {
        const res = await request.get('balances/search', {
            params: {
                keyword:keyword
            },
            headers:headers
        })
        // console.log(res)
        return res
        
    } catch (error) {
    }
}