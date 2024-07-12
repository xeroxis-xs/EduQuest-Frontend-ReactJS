import type { Quest } from "@/types/quest";
import type { Answer } from "@/types/answer";

export interface Question {
  id: number;
  number: number;
  from_quest: Quest;
  text: string;
  correct_answer: string;
  max_score: number;
  answers: Answer[];
}
