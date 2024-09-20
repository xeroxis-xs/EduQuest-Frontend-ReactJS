export interface AnalyticsPartTwo {
  user_course_progression: UserCourseProgression[];
  user_badge_progression: UserBadgeProgression[];
}

export interface UserBadgeProgression {
  badge_id: number;
  badge_name: string;
  badge_filename: string;
  count: number;
}
export interface UserCourseProgression {
  course_id: number;
  course_term: string;
  course_name: string;
  course_code: string;
  completed_quests: number;
  total_quests: number;
  completion_ratio: number;
  quest_scores: QuestScore[];
}

export interface QuestScore {
  quest_id: number;
  quest_name: string;
  max_score: number;
  highest_score: number;
}
