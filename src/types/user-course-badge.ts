import type { Badge } from "@/types/badge";
import {UserCourseGroupEnrollment} from "@/types/user-course-group-enrollment";

export interface UserCourseBadge {
  id: number;
  badge: Badge;
  user_course_group_enrollment: UserCourseGroupEnrollment
  awarded_date: string; // ISO 8601 datetime string
}
