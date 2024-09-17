import { Answer } from "@/types/answer";


export interface Question {
  id: number;
  number: number;
  text: string;
  max_score: number;
  answers: Answer[];
}

export interface QuestionMultipleNewForm {
  quest_id: number;
  text: string;
  number: number;
  max_score: number;
  answers: Answer[];
}
