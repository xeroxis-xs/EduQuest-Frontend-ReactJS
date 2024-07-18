import type {Term} from "@/types/term";
import type {Image} from "@/types/image";

export interface Course {
  id: number;
  term: Term;
  name: string;
  code: string;
  description: string;
  status: string;
  enrolled_users: number[];
  image: Image;
}
