import axios from "axios";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

const baseURL = import.meta.env.VITE_BACKEND_URL;
const instance = axios.create({
    baseURL: baseURL,
    // set refresh token in cookie
    withCredentials: true,

});
// gan access token moi lan goi api
instance.defaults.headers.common = { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }

// const handleRefreshToken = async () => {
//     const res = await instance.get("/api/v1/auth/refresh");
//     console.log("check res refresh token", res);
//     if (res && res.data) return res.data.access_token;
//     else null;

// }

const handleRefreshToken = async () => {
    // const res = await instance.get('/api/v1/auth/refresh');
    // if (res && res.data) return res.data.access_token;
    // else null;
    return await mutex.runExclusive(async () => {
        const res = await instance.get('/api/v1/auth/refresh');
        if (res && res.data) return res.data.access_token;
        else return null;
    });
}

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    if (typeof window !== "undefined" && window && window.localStorage && window.localStorage.getItem('access_token')) {
        config.headers.Authorization = `Bearer ` + window.localStorage.getItem('access_token');
    }
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

const NO_RETRY_HEADER = 'x-no-retry'

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // console.log("check response", response)
    return response && response.data ? response.data : response;
}, async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log("check error", error)
    if (error.config && error.response
        && +error.response.status === 401
        && !error.config.headers[NO_RETRY_HEADER]
    ) {
        const access_token = await handleRefreshToken();
        error.config.headers[NO_RETRY_HEADER] = 'true'
        if (access_token) {
            error.config.headers['Authorization'] = `Bearer ${access_token}`;
            localStorage.setItem('access_token', access_token);
            return instance.request(error.config);
        }
    }
    // handle refresh token expired, redirect the user to the login page
    if (
        error.config && error.response
        && +error.response.status === 400
        && error.config.url === '/api/v1/auth/refresh'
    ) {
        window.location.href = '/login';
    }
    return error?.response?.data ?? Promise.reject(error);
});

export default instance;