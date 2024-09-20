export interface AnalyticsPartFour {
  course_id: number;
  course_code: string;
  course_name: string;
  course_term: string;
  course_image: string;
  course_groups: CourseGroup[];
}

export interface CourseGroup {
  group_id: number;
  group_name: string;
  enrolled_students: number;
  quests: Quest[]
}

interface Quest {
  quest_id: number;
  quest_name: string;
  quest_completion: number;
}
