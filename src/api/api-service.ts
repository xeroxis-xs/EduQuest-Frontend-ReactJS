import axios from 'axios';
// import { getToken } from '@/app/msal/msal';
// import { logger } from '@/lib/default-logger';
// import { type WooclapUser } from '@/types/wooclap-user';


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

// export async function getWooclapUser(): Promise<WooclapUser> {
//   try {
//     const response = await api.get<WooclapUser>("/api/WooclapUsers/")
//     return response.data;
//   } catch (error) {
//     logger.error('API request failed.', error);
//     throw error;
//   }
// };
//
// export const fetchWooclapUserData = async (): Promise<WooclapUser> => {
//   api
//     .get('/api/WooclapUsers/')
//     .then((response) => {
//       response.data
//     })
//     .then((data) => {
//       return data;
//     }
// }

