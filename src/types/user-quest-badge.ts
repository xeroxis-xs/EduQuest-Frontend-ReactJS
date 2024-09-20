import type { Badge } from "@/types/badge";
import {type UserQuestAttemptSummary} from "@/types/user-quest-attempt";

export interface UserQuestBadge {
  id: number;
  badge: Badge;
  user_quest_attempt: UserQuestAttemptSummary;
  awarded_date: string; // ISO 8601 datetime string
}
