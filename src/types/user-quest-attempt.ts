import type { EduquestUser } from './eduquest-user';
import type { Quest } from './quest';

export interface UserQuestAttempt {
  id: number
  first_attempted_on: string | null // ISO 8601 datetime string
  last_attempted_on: string | null// ISO 8601 datetime string
  all_questions_submitted: boolean
  time_taken: number
  total_score_achieved: number
  user: EduquestUser['id']
  quest: Quest
}
