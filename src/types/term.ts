import type { AcademicYear } from "@/types/academic-year";


export interface Term {
  id: number;
  academic_year: AcademicYear
  name: string;
  start_date: string; // ISO 8601 date string
  end_date: string; // ISO 8601 date string
}
