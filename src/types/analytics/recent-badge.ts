import type { UserQuestBadge } from "@/types/user-quest-badge";
import type { UserCourseBadge } from "@/types/user-course-badge";

export interface ExtendedUserCourseBadge extends UserCourseBadge {
  user_id: number;
  nickname: string;
}

export interface ExtendedUserQuestBadge extends UserQuestBadge {
  user_id: number;
  nickname: string;
}
