import { useContext } from 'react'
import * as request from '../../utils/httpRequest'
import { createAuthHeader } from '../../utils/createAuthHeader'
export const getListVariant = async(param = {page:1, pageSize:10}, token) => {
    const headers = createAuthHeader(token);
    try {
        const res = await request.get('/base-products/variants', {
            params: {
                page: param.page,
                size:param.pageSize
            },
            headers:headers
        })
        // console.log(res)
        return res

    } catch (error) {
    }
}


export const searchVariant = async(keyword, token) => {
    const headers = createAuthHeader(token);
    try {
        const res = await request.get('base-products/variants/search', {
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