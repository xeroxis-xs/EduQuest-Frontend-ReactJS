import apiService from "@/api/api-service";
import type { UserCourseGroupEnrollment } from "@/types/user-course-group-enrollment";


export const getUserCourseGroupEnrollments = async (): Promise<UserCourseGroupEnrollment[]> => {
  const response = await apiService.get<UserCourseGroupEnrollment[]>('/api/user-course-group-enrollments/');
  return response.data;
}

export const getUserCourseGroupEnrollment = async (id: string): Promise<UserCourseGroupEnrollment> => {
  const response = await apiService.get<UserCourseGroupEnrollment>(`/api/user-course-group-enrollments/${id}/`);
  return response.data;
}

export const getUserCourseGroupEnrollmentsByCourseAndUser = async (courseId: string, userId: string): Promise<UserCourseGroupEnrollment[]> => {
  const response = await apiService.get<UserCourseGroupEnrollment[]>(`/api/user-course-group-enrollments/by_course_and_user/?course_id=${courseId}&user_id=${userId}`);
  return response.data;
}

export const getUserCourseGroupEnrollmentsByCourseGroupAndUser = async (courseGroupId: string, userId: string): Promise<UserCourseGroupEnrollment[]> => {
  const response = await apiService.get<UserCourseGroupEnrollment[]>(`/api/user-course-group-enrollments/by_course_group_and_user/?course_group_id=${courseGroupId}&user_id=${userId}`);
  return response.data;
}

export const createUserCourseGroupEnrollment = async (userCourseGroupEnrollmentNewForm: UserCourseGroupEnrollment): Promise<UserCourseGroupEnrollment> => {
  const response = await apiService.post<UserCourseGroupEnrollment>('/api/user-course-group-enrollments/', userCourseGroupEnrollmentNewForm);
  return response.data;
}

