import request from '../utils/httpRequest';


export const createItem = async(formData) => {
    try {
        console.log(formData)
        const res = await request.post('category', formData)
        return true;
        //console.log(res.data)
        
    } catch (error) {
        console.log('getCategory ' + error)
        return false;
    }
}