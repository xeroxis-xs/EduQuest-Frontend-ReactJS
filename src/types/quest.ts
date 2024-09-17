import type {Image} from "@/types/image";
import type {CourseGroup} from "@/types/course-group";
import type {EduquestUserSummary, EduquestUser} from "@/types/eduquest-user";


export interface Quest {
  course_group: CourseGroup;
  organiser: EduquestUserSummary;
  image: Image;
  id: number;
  name: string;
  description: string;
  type: string;
  status: string;
  tutorial_date: string | null // ISO 8601 datetime string
  expiration_date: string | null;
  max_attempts: number;
  total_max_score: number;
  total_questions: number;
}

export interface QuestNewForm {
  course_group_id: CourseGroup['id'];
  organiser_id: EduquestUser['id'];
  image_id: Image['id'];
  name: string;
  description: string;
  type: string;
  status: string;
  expiration_date: string | null;
  tutorial_date?: string | null;
  max_attempts: number;
}

export interface QuestUpdateForm {
  course_group_id?: CourseGroup['id'];
  image_id?: Image['id'];
  name?: string;
  description?: string;
  type?: string;
  status?: string;
  expiration_date?: string | null;
  tutorial_date?: string | null;
  max_attempts?: number;
}
