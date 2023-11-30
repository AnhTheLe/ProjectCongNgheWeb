import { useContext } from 'react'
import * as request from '../../utils/httpRequest'
import { createAuthHeader } from '../../utils/createAuthHeader'
export const getListProduct = async(param, token) => {
    const headers = createAuthHeader(token);
    try {
        const res = await request.get('/base-products', {
            params: {
                page: param.page+1,
                size:param.pageSize
            },
            headers:headers
        })
        // console.log(res)
        return res

    } catch (error) {
        console.log('getListProduct ' + error)
    }
}

export const searchProduct = async(keyword, token) => {
    const headers = createAuthHeader(token);
    try {
        const res = await request.get('base-products/search', {
            params: {
                keyword:keyword
            },
            headers:headers
        })
        // console.log(res)
        return res

    } catch (error) {
        console.log('getListProduct ' + error)
    }
}