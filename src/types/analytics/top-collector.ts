import type { EduquestUser } from "@/types/eduquest-user";
import type { UserQuestBadge } from "@/types/user-quest-badge";
import {UserCourseBadge} from "@/types/user-course-badge";

export interface TopCollector {
    user_id: EduquestUser['id'],
    nickname: EduquestUser['nickname'],
    badge_count: number,
    quest_badges: UserQuestBadge[],
    course_badges: UserCourseBadge[];
}
