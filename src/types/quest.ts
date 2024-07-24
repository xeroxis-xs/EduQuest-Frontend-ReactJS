import type { EduquestUser } from './eduquest-user';
import type { Course } from './course';
import type { Image } from "@/types/image";

export interface Quest {
  id: number
  from_course: Course;
  name: string;
  description: string;
  type: string;
  status: string;
  max_attempts: number;
  organiser: EduquestUser;
  total_max_score: number;
  total_questions: number;
  image: Image;
}
