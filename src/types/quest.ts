import type { EduquestUser } from './eduquest-user';
import type { Course } from './course';

export interface Quest {
  id: number
  from_course: Course;
  name: string;
  description: string;
  type: string;
  status: string;
  organiser: EduquestUser;
}
