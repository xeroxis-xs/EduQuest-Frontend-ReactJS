import type { EduquestUser } from './eduquest-user';
import type { Course } from './course';
import {Image} from "@/types/image";

export interface Quest {
  id: number
  from_course: Course;
  name: string;
  description: string;
  type: string;
  status: string;
  organiser: EduquestUser;
  total_max_score: number;
  total_questions: number;
  image: Image;
}
