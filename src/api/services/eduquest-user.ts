import apiService from "@/api/api-service";
import type { EduquestUser, EduquestUserUpdateForm } from "@/types/eduquest-user";


export const getEduquestUser = async (id: string): Promise<EduquestUser> => {
    const response = await apiService.get<EduquestUser>(`/api/eduquest-users/${id}/`);
    return response.data;
}

export const getAllEduquestUsers = async (): Promise<EduquestUser[]> => {
  const response = await apiService.get<EduquestUser[]>('/api/eduquest-users/');
  return response.data;
}

export const getAdminEduquestUsers = async (): Promise<EduquestUser[]> => {
  const response = await apiService.get<EduquestUser[]>('/api/eduquest-users/by_admin/');
  return response.data;
}

export const updateEduquestUser = async (id: string, eduquestUserUpdateForm: EduquestUserUpdateForm ): Promise<EduquestUser> => {
  const response = await apiService.patch<EduquestUser>(`/api/eduquest-users/${id}/`, eduquestUserUpdateForm);
  return response.data;
}
