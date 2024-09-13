import type { EduquestUser } from "@/types/eduquest-user";
import type { Badge } from "@/types/badge";
import type { Course } from "@/types/course";
import type { Quest } from "@/types/quest";


export interface RecentBadge {
  record_id: number;
  user_id: EduquestUser['id'],
  nickname: EduquestUser['nickname'],
  badge_name: Badge['name'],
  awarded_date: string,
  course_id: Course['id'],
  course_code: Course['code'],
  course_name: Course['name'],
  quest_id: Quest['id'] | null,
  quest_name: Quest['name'] | null,
}
