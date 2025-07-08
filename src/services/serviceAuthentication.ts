import api from "..//api/axiosConfig";
import { CredentialsLogin, ResponseLoginApi } from "../types/api";

export async function performLogin(credentials: CredentialsLogin): Promise<ResponseLoginApi> {
  try {
    const response = await api.post<ResponseLoginApi>('auth/login', {
      username: credentials.usuario,
      password: credentials.senha,
    });
    return response.data;
  } catch (erro: any) {
    if (erro.response && erro.response.status === 401) {
      throw new Error("Credenciais inválidas. Verifique seu usuário e senha.")
    }
    throw new Error("Erro ao conectar com o servidor. Tente novamente mais tarde.")
  }
}