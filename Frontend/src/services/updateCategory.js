import request from '../utils/httpRequest';


export const updateItem = async(id, formData) => {
    try {
        console.log('**************************')
        console.log(formData)
        const res = await request.put(`category/${id}`, formData)
        return true;
        //console.log(res.data)
        
    } catch (error) {
        console.log('getCategory ' + error)
        return false;
    }
}