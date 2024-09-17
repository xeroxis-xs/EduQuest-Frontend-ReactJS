import apiService from "@/api/api-service";
import type { Quest, QuestNewForm, QuestUpdateForm } from "@/types/quest";


export const getQuests = async (): Promise<Quest[]> => {
  const response = await apiService.get<Quest[]>('/api/quests/');
  return response.data;
}

export const getQuest = async (id: string): Promise<Quest> => {
  const response = await apiService.get<Quest>(`/api/quests/${id}/`);
  return response.data;
}

export const getNonPrivateQuests = async (): Promise<Quest[]> => {
  const response = await apiService.get<Quest[]>('/api/quests/non_private/');
  return response.data;
}

export const getMyPrivateQuests = async (): Promise<Quest[]> => {
  const response = await apiService.get<Quest[]>('/api/quests/private_by_user/');
  return response.data;
}

export const getQuestsByEnrolledUser = async(id: string): Promise<Quest[]> => {
  const response = await apiService.get<Quest[]>(`/api/quests/by_enrolled_user/?user_id=${id}`);
  return response.data;
}

export const getQuestsByCourseGroup = async(id: string): Promise<Quest[]> => {
  const response = await apiService.get<Quest[]>(`/api/quests/by_course_group/?course_group_id=${id}`);
  return response.data;
}

export const createQuest = async (questNewForm: QuestNewForm): Promise<Quest> => {
  const response = await apiService.post<Quest>('/api/quests/', questNewForm);
  return response.data;
}

export const updateQuest = async (id: string, questUpdateForm: QuestUpdateForm): Promise<Quest> => {
  const response = await apiService.patch<Quest>(`/api/quests/${id}/`, questUpdateForm);
  return response.data;
}

export const deleteQuest = async (id: string): Promise<void> => {
  await apiService.delete(`/api/quests/${id.toString()}/`);
}
