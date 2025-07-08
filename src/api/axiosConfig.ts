import axios from "axios";
import { getToken, removeToken } from "../services/serviceStorage"

const api = axios.create({
  baseURL: 'https://fakestoreapi.com/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Beater ${token}`
    }
    return config;
  },
  (erro) => {
    return Promise.reject(erro);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (erro) => {
    if (erro.response && erro.response.status === 401) {
      await removeToken();
      console.warn("Token de autenticação expirado ou inválido. Realize o login novamente")
    }
    return Promise.reject(erro);
  }
);

export default api;