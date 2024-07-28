import type { Badge } from "@/types/badge";
import type { UserQuestAttempt } from "@/types/user-quest-attempt";

export interface UserQuestBadge {
  id: number;
  badge: Badge;
  quest_attempted: UserQuestAttempt;
  awarded_on: string; // ISO 8601 datetime string
}
