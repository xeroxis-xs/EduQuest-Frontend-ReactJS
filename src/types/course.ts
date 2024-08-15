import type {Term} from "@/types/term";
import type {Image} from "@/types/image";

export interface Course {
  id: number;
  term: Term;
  name: string;
  code: string;
  type: string;
  description: string;
  status: string;
  enrolled_users: string[]; // list of user id in string
  image: Image;
}
