import axios from 'axios';

const api = axios.create({
  baseURL: 'https://eduquest-microservice.azurewebsites.net',
})

export default api;
