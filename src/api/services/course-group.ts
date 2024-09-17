import apiService from "@/api/api-service";
import type {CourseGroup, CourseGroupNewForm, CourseGroupUpdateForm} from "@/types/course-group";


export const getCourseGroups = async (): Promise<CourseGroup[]> => {
  const response = await apiService.get<CourseGroup[]>('/api/course-groups/');
  return response.data;
}

export const getCourseGroup = async (id: string): Promise<CourseGroup> => {
  const response = await apiService.get<CourseGroup>(`/api/course-groups/${id}/`);
  return response.data;
}

export const getCourseGroupsByCourse = async (courseId: string): Promise<CourseGroup[]> => {
  const response = await apiService.get<CourseGroup[]>(`/api/course-groups/by_course/?course_id=${courseId}`);
  return response.data;
}

export const createCourseGroup = async (courseGroupNewForm: CourseGroupNewForm): Promise<CourseGroup> => {
  const response = await apiService.post<CourseGroup>('/api/course-groups/', courseGroupNewForm);
  return response.data;
}

export const updateCourseGroup = async (id: string, courseGroupUpdateForm: CourseGroupUpdateForm): Promise<CourseGroup> => {
  const response = await apiService.patch<CourseGroup>(`/api/course-groups/${id}/`, courseGroupUpdateForm);
  return response.data;
}

export const deleteCourseGroup = async (id: string): Promise<void> => {
  await apiService.delete(`/api/course-groups/${id}/`);
}
