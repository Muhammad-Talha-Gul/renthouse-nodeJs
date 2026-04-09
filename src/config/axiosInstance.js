import axios from 'axios';
import baseURL from './baseURL';

// Create an axios instance with default configurations
const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    withXSRFToken: true,
});
export default axiosInstance;
