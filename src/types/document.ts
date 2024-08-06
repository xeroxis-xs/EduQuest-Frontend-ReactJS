import type {EduquestUser} from "@/types/eduquest-user";

export interface Document {
  id: number;
  name: string;
  file: string;
  size: number;
  uploaded_at: string;
  uploaded_by: EduquestUser['id'];
}
