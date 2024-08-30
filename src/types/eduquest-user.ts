export interface EduquestUser {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  nickname: string;
  last_login: string; // ISO 8601 datetime string
  updated_at: string; // ISO 8601 datetime string
  is_superuser: boolean;
  is_active: boolean;
  is_staff: boolean;
  total_points: number;
}
