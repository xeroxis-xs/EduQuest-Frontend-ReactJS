import apiService from "@/api/api-service";
import type {Course, CourseNewForm, CourseUpdateForm} from "@/types/course";


export const getCourses = async (): Promise<Course[]> => {
  const response = await apiService.get<Course[]>('/api/courses/');
  return response.data;
}

export const getNonPrivateCourses = async (): Promise<Course[]> => {
  const response = await apiService.get<Course[]>('/api/courses/non_private/');
  return response.data;
}

export const getCourse = async (id: string): Promise<Course> => {
  const response = await apiService.get<Course>(`/api/courses/${id}/`);
  return response.data;
}

export const createCourse = async (courseNewForm: CourseNewForm): Promise<Course> => {
  const response = await apiService.post<Course>('/api/courses/', courseNewForm);
  return response.data;
}

export const updateCourse = async (id: string, courseUpdateForm: CourseUpdateForm): Promise<Course> => {
  const response = await apiService.patch<Course>(`/api/courses/${id}/`, courseUpdateForm);
  return response.data;
}

export const deleteCourse = async (id: Course['id']): Promise<void> => {
  await apiService.delete(`/api/courses/${id.toString()}/`);
}
