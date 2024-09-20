import apiService from "@/api/api-service";
import type { Answer } from "@/types/answer";

// To use for quest import after uploading the CSV file
// Instructor to update all the answers for the questions
export const updateMultipleAnswers = async (answers: Answer[]): Promise<Answer[]> => {
  const response = await apiService.put<Answer[]>('/api/answers/bulk-update/', answers);
  return response.data;
}
