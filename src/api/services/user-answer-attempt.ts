import type { UserAnswerAttempt, UserAnswerAttemptUpdateForm } from "@/types/user-answer-attempt";
import apiService from "@/api/api-service";



// export const getUserAnswerAttempt = async (id: string): Promise<UserAnswerAttempt> => {
//   const response = await apiService.get<UserAnswerAttempt>(`/api/user-answer-attempts/${id}/`);
//   return response.data;
// }
//
// export interface getUserAnswerAttempts = async (): Promise<UserAnswerAttempt[]> => {
//   const response = await apiService.get<UserAnswerAttempt[]>('/api/user-answer-attempts/');
//   return response.data;
// }


export const getUserAnswerAttemptByUserQuestAttempt = async (id: string): Promise<UserAnswerAttempt[]> => {
  const response = await apiService.get<UserAnswerAttempt[]>(`/api/user-answer-attempts/by_user_quest_attempt/?user_quest_attempt_id=${id}`);
  return response.data;
}

export const getUserAnswerAttemptByQuest = async (id: string): Promise<UserAnswerAttempt[]> => {
  const response = await apiService.get<UserAnswerAttempt[]>(`/api/user-answer-attempts/by_quest/?quest_id=${id}`);
  return response.data;
}

export const updateMultipleUserAnswerAttempts = async (updatedUserAnswerAttempts: UserAnswerAttemptUpdateForm[]): Promise<UserAnswerAttempt[]> => {
  const response = await apiService.patch<UserAnswerAttempt[]>('/api/user-answer-attempts/bulk-update/', updatedUserAnswerAttempts);
  return response.data;
}
