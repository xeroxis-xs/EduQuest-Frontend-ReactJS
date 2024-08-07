import type { Course } from "@/types/course";
import {EduquestUser} from "@/types/eduquest-user";

export interface UserCourse {
  id: number;
  course: Course['id'];
  user: EduquestUser['id'];
  enrolled_on: string; // ISO 8601 datetime string
  completed_on: string; // ISO 8601 datetime string
}
