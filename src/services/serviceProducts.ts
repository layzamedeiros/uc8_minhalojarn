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