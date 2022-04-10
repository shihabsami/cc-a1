import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
export const api = axios.create({
  baseURL: backendUrl
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`
      };
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
