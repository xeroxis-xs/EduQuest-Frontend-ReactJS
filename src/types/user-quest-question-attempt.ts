import type { AttemptAnswerRecord } from "@/types/attempt-answer-record";
import type { Question } from "@/types/question";
import type { UserQuestAttempt } from "@/types/user-quest-attempt";

export interface UserQuestQuestionAttempt {
  id: number
  selected_answers: AttemptAnswerRecord[],
  question: Question,
  score_achieved: number,
  submitted: boolean,
  user_quest_attempt: UserQuestAttempt['id']
}
