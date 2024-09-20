import apiService from "@/api/api-service";
import type {Document} from "@/types/document";


export const getMyDocuments = async (userId: string): Promise<Document[]> => {
  const response = await apiService.get<Document[]>(`/api/documents/by_user/?user_id=${userId}`);
  return response.data;
}

export const uploadDocument = async (formData: FormData): Promise<Document> => {
  const response = await apiService.post<Document>('/api/documents/upload/', formData);
  return response.data;
}

export const deleteDocument = async (documentId:string): Promise<void> => {
  await apiService.delete(`/api/documents/${documentId}/`);
}
