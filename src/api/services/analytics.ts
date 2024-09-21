import apiService from "@/api/api-service";
import {type AnalyticsPartOne} from "@/types/analytics/analytics-one";
import {type AnalyticsPartTwo} from "@/types/analytics/analytics-two";
import {type AnalyticsPartThree} from "@/types/analytics/analytics-three";
import {type AnalyticsPartFour} from "@/types/analytics/analytics-four";

export const getAnalyticsPartOne = async (): Promise<AnalyticsPartOne> => {
  const response = await apiService.get<AnalyticsPartOne>('/api/analytics/part-one/');
  return response.data;
}

export const getAnalyticsPartTwo = async (userId: number, option: string): Promise<AnalyticsPartTwo> => {
  const response = await apiService.get<AnalyticsPartTwo>(`/api/analytics/part-two/?user_id=${userId.toString()}&option=${option}`);
  return response.data;
}

export const getAnalyticsPartThree = async (): Promise<AnalyticsPartThree> => {
  const response = await apiService.get<AnalyticsPartThree>('/api/analytics/part-three/');
  return response.data;
}

export const getAnalyticsPartFour = async (): Promise<AnalyticsPartFour[]> => {
  const response = await apiService.get<AnalyticsPartFour[]>('/api/analytics/part-four/');
  return response.data;
}
