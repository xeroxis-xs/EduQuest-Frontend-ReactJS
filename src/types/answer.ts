import type { Question } from "@/types/question";

export interface Answer {
  id: number;
  question: Question['id'];
  text: string;
  is_correct: boolean;
}
