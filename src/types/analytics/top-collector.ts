import type { EduquestUser } from "@/types/eduquest-user";
import type { Badge } from "@/types/badge";

export interface TopCollector {
    user_id: EduquestUser['id'],
    nickname: EduquestUser['nickname'],
    badge_count: number,
    quest_badges: BadgeCount[],
    course_badges: BadgeCount[];
}

interface BadgeCount {
  badge_id: Badge['id'];
  badge_name: Badge['name'];
  badge_filename: Badge['image']['filename'];
  count: number;
}
