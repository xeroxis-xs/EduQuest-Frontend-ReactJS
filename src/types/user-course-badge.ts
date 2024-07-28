import type { Badge } from "@/types/badge";
import type { UserCourse } from "@/types/user-course";

export interface UserCourseBadge {
  id: number;
  badge: Badge;
  course_completed: UserCourse;
  awarded_on: string; // ISO 8601 datetime string
}
