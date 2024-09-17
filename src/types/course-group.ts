import type { EduquestUserSummary } from './eduquest-user';
import type { Course } from './course';

export interface CourseGroup {
  course_id: Course['id']
  instructor: EduquestUserSummary
  id: number
  name: string
  session_day: string
  session_time: string
  total_students_enrolled: number
}

export interface CourseGroupNewForm {
  course_id: Course['id']
  instructor_id: EduquestUserSummary['id']
  name: string
  session_day: string
  session_time: string
}

export interface CourseGroupUpdateForm {
  course_id?: Course['id']
  instructor_id?: EduquestUserSummary['id']
  name?: string
  session_day?: string
  session_time?: string
}
