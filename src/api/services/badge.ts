import apiService from "@/api/api-service";
import type { Badge } from "@/types/badge";
import type { UserQuestBadge} from "@/types/user-quest-badge";
import type { UserCourseBadge } from "@/types/user-course-badge";

export const getBadges = async (): Promise<Badge[]> => {
  const response = await apiService.get<Badge[]>('/api/badges/');
  return response.data;
}

export const getUserQuestBadges = async (): Promise<UserQuestBadge[]> => {
  const response = await apiService.get<UserQuestBadge[]>('/api/user-quest-badges/');
  return response.data;
}

export const getUserCourseBadges = async (): Promise<UserCourseBadge[]> => {
  const response = await apiService.get<UserCourseBadge[]>('/api/user-course-badges/');
  return response.data;
}
