export interface AnalyticsPartOne {
  user_stats: UserStats;
  course_enrollment_stats: CourseEnrollmentStats;
  quest_attempt_stats: QuestAttemptStats;
  shortest_time_user: ShortestTimeUser | null;
}

interface CourseEnrollmentStats {
  total_enrollments: number;
  new_enrollments_percentage: number;
}

interface QuestAttemptStats {
  total_quest_attempts: number;
  new_quest_attempts_percentage: number;
}

export interface ShortestTimeUser {
  nickname: string;
  time_taken: number;
  quest_id: number;
  quest_name: string;
  course: string;
}

interface UserStats {
  total_users: number;
  new_users_percentage: number;
}
