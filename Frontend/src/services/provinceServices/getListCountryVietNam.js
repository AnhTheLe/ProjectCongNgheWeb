import axios from 'axios';

const request = axios.create({
    baseURL: 'https://vn-public-apis.fpo.vn/provinces/getAll',
});

export const getListCountryVietNam = async() => {
    try {
        const res = await request.get('', {
            params: {
                limit:-1
            },
        })
        console.log(res.data.data);
        return res.data.data
        
    } catch (error) {
        console.log('getListCountryVietNam ' + error)
    }
}