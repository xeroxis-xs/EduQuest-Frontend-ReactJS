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

export interface Quest {
  quest_id: number;
  quest_name: string;
  quest_completion: number;
  quest_max_score: number;
  students_progress: StudentsProgress[];
}

interface StudentsProgress {
  username: string;
  highest_score: number | null;
}
