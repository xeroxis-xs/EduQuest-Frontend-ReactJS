import type { AcademicYear } from "@/types/academic-year";


export interface Term {
  id: number;
  academic_year: AcademicYear
  name: string;
  start_date: string | null; // ISO 8601 date string
  end_date: string | null; // ISO 8601 date string
}
