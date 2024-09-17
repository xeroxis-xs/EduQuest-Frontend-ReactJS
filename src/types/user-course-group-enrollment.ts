import type { EduquestUserSummary } from './eduquest-user';
import type {CourseGroup} from "@/types/course-group";

export interface UserCourseGroupEnrollment {
  course_group_id: CourseGroup['id']
  student_id: EduquestUserSummary['id']
  id: number
  enrolled_on: string
  completed_on: string | null
}

export interface UserCourseGroupEnrollmentNewForm {
  course_group_id: CourseGroup['id']
  student_id: EduquestUserSummary['id']
}

