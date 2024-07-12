import type { EduquestUser } from './eduquest-user';
import type { Quest } from './quest';

export interface UserQuestAttempt {
  id: number
  first_attempted_on: string // ISO 8601 datetime string
  last_attempted_on: string // ISO 8601 datetime string
  graded: boolean
  time_taken: number
  user: EduquestUser['id']
  quest: Quest['id']
}
