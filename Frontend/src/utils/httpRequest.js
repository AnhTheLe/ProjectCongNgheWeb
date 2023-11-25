import axios from 'axios';

const request = axios.create({
    baseURL: 'http://localhost:8080/admin',
});

export const get = async (path, option = {}) => {
    const response = await request.get(path, option);
    return response.data;
};

export const post = async (path, option = {}) => {
    const response = await request.post(path, option);
    return response.data;
};

export default request;
