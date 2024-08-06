import type { GeneratedAnswer } from "@/types/generated-answer";

export interface GeneratedQuestion {
  number: number;
  text: string;
  answers: GeneratedAnswer[];
}
