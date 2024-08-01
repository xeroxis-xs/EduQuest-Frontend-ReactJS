import type {Term} from "@/types/term";
import type {Image} from "@/types/image";
import type {UserCourse} from "@/types/user-course";

export interface Course {
  id: number;
  term: Term;
  name: string;
  code: string;
  type: string;
  description: string;
  status: string;
  enrolled_users: UserCourse[];
  image: Image;
}
