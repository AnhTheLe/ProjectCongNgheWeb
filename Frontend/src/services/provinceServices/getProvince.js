import axios from 'axios';

const request = axios.create({
    baseURL: 'https://provinces.open-api.vn/api/',
});

export const getProvince = async() => {
    try {
        const res = await request.get('', {
            params: {
                depth:3
            },
        })
        return res
        
    } catch (error) {
        console.log('getProvince ' + error)
    }
}