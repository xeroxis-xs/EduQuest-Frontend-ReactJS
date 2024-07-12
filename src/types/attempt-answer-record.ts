import type { Answer } from "@/types/answer";
import type { UserQuestQuestionAttempt } from "@/types/user-quest-question-attempt";

export interface AttemptAnswerRecord {
  id: number
  answer: Answer
  user_quest_question_attempt: UserQuestQuestionAttempt['id']
}
