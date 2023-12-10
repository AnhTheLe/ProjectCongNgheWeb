import * as request from '../utils/httpRequest';

export const getList = async() => {
    try {
        const res = await request.get('category/all', {
            params: {}
        })
        //console.log(res.data)
        return res.data
        
    } catch (error) {
        console.log('getCategory ' + error)
    }
}