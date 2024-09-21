import type { EduquestUserSummary } from './eduquest-user';
import type {Course, CourseSummary} from './course';

export interface CourseGroup {
  course: CourseSummary
  instructor: EduquestUserSummary
  id: number
  name: string
  session_day: string
  session_time: string
  total_students_enrolled: number
}

export interface CourseGroupSummary {
  course: CourseSummary
  id: number
  name: string
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
