import type {Term} from "@/types/term";

export interface Course {
  id: number;
  term: Term
  name: string;
  code: string;
  description: string;
  status: string;
  total_quests: number;
}
