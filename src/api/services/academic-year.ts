import apiService from "@/api/api-service";
import type { AcademicYear } from "@/types/academic-year";

export const getAcademicYears = async (): Promise<AcademicYear[]> => {
  const response = await apiService.get<AcademicYear[]>('/api/academic-years/');
  return response.data;
}

export const getNonPrivateAcademicYears = async (): Promise<AcademicYear[]> => {
  const response = await apiService.get<AcademicYear[]>('/api/academic-years/non_private/');
  return response.data;
}

export const getAcademicYear = async (id: string): Promise<AcademicYear> => {
  const response = await apiService.get<AcademicYear>(`/api/academic-years/${id}/`);
  return response.data;
}

export const createAcademicYear = async (academicYear: AcademicYear): Promise<AcademicYear> => {
  const response = await apiService.post<AcademicYear>('/api/academic-years/', academicYear);
  return response.data;
}

export const updateAcademicYear = async (id: string, academicYear: AcademicYear): Promise<AcademicYear> => {
  const response = await apiService.patch<AcademicYear>(`/api/academic-years/${id}/`, academicYear);
  return response.data;
}

export const deleteAcademicYear = async (id: string): Promise<void> => {
  await apiService.delete(`/api/academic-years/${id}/`);
}
