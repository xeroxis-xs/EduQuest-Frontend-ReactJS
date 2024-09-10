export interface UserCourseProgression {
  course_id: number;
  course_term: string;
  course_name: string;
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
