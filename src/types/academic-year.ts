export interface AcademicYear {
  id: number;
  start_year: number;
  end_year: number;
}

export interface AcademicYearNewForm {
  start_year: number;
  end_year: number;
}

export interface AcademicYearUpdateForm {
  start_year?: number;
  end_year?: number;
}
