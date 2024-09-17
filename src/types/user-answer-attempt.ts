import {UserQuestAttempt} from "@/types/user-quest-attempt";
import {Answer, Question} from "@/types/question";

export interface UserAnswerAttempt {
  id: number
  user_quest_attempt_id: UserQuestAttempt['id']
  question_id: Question['id']
  answer_id: Answer['id']
  is_selected: boolean
  score_achieved: number
}

export interface UserAnswerAttemptNewForm {
  user_quest_attempt_id: UserQuestAttempt['id']
  question_id: Question['id']
  answer_id: Answer['id']
  is_selected: boolean
  score_achieved: number
}

export interface UserAnswerAttemptUpdateForm {
  user_quest_attempt_id?: UserQuestAttempt['id']
  question_id?: Question['id']
  answer_id?: Answer['id']
  is_selected?: boolean
  score_achieved?: number
}
