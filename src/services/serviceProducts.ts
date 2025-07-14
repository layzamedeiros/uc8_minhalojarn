import api from "../api/axiosConfig";
import { ProductApi } from "../types/api";

export async function getAllProducts(): Promise<ProductApi[]> {
  try {
    const response = await api.get<ProductApi[]>("products");
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Erro ao buscar produtos.");
  }
}

export async function getProductById(id: number): Promise<ProductApi> {
  try {
    const response = await api.get<ProductApi>(`products/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
    }
    throw new Error(error.message || "Erro ao buscar detalhes do produto.");
  }
}