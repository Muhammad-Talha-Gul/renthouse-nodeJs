import axios from 'axios';

// Create an axios instance with default configurations
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
    withXSRFToken: true,
});
export default axiosInstance;
