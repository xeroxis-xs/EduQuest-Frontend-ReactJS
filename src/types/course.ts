import type {Term} from "@/types/term";
import type {Image} from "@/types/image";
import type {EduquestUserSummary, EduquestUser} from "@/types/eduquest-user";


export interface Course {
  term: Term;
  image: Image;
  coordinators_summary: EduquestUserSummary[];
  id: number;
  name: string;
  code: string;
  type: string;
  description: string;
  status: string;
  total_students_enrolled: number;
}

export interface CourseSummary {
  id: number;
  name: string;
  code: string;
  term: Term['id'];
  status: string;
}

export interface CourseNewForm {
  term_id: Term['id'];
  image_id: Image['id'];
  coordinators: EduquestUser['id'][];  // must have at least 1 coordinator
  name: string;
  code: string;
  type: string;
  description: string;
  status: string;
}

export interface CourseUpdateForm {
  term_id?: Term['id'];
  image_id?: Image['id'];
  coordinators?: EduquestUser['id'][];  // must have at least 1 coordinator
  name?: string;
  code?: string;
  type?: string;
  description?: string;
  status?: string;
}
