// api/axiosClient.js
import axios from 'axios';

import queryString from 'query-string';

// Cai dat config mac dinh cho http request
// Tham khao: `https://github.com/axios/axios#request-config`
// de xem chi tiet
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }

    return response;
  },
  (error) => {
    let errorMessage = null;
    const response = error.response;
    if (response && (response.status === 403 || response.status === 401)) {
      return;
    }
    if (response && response.data) {
      const data = response.data;
      const { result, message } = response.data;
      if (result === 'failed') {
        errorMessage = message;
      }
    }
    if (errorMessage) {
      /* empty */
    }
    throw error;
  }
);

// Update base url
const updateAxiosBaseURL = (baseUrl: string) => {
  axiosClient.defaults.baseURL = baseUrl;
};

// Update access token
const updateAxiosAccessToken = (accessToken: string) => {
  axiosClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
};

// Remove access token
const removeAxiosAccessToken = () => {
  delete axiosClient.defaults.headers.common['Authorization'];
};

export { updateAxiosAccessToken, removeAxiosAccessToken, updateAxiosBaseURL };

export default axiosClient;
