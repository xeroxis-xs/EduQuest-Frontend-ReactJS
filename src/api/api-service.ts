import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
})

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('access-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  async () => {
    return Promise.reject(new Error('Failed to set access-token for API request.'));
  }
)

export default api;
