import apiService from "@/api/api-service";
import type { Image } from "@/types/image";


export const getImages = async (): Promise<Image[]> => {
  const response = await apiService.get<Image[]>('/api/images/');
  return response.data;
}

export const getImage = async (id: string): Promise<Image> => {
  const response = await apiService.get<Image>(`/api/images/${id}/`);
  return response.data;
}
