export interface PerformanceReview {
  id: string;
  userId: string;
  reviewerId?: string | null;
  period: string;
  startDate?: string | null;
  endDate?: string | null;
  rating?: number | null;
  score?: number | null;
  feedback?: string | null;
  strengths?: string | null;
  improvements?: string | null;
  status: "draft" | "in_review" | "completed";
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    employeeCode: string | null;
    department?: { id: string; name: string } | null;
    position?: { id: string; name: string } | null;
  };
  kpis?: KpiItem[];
}

export interface CreateReviewDto {
  userId: string;
  period: string;
  startDate?: string;
  endDate?: string;
  rating?: number;
  score?: number;
  feedback?: string;
  strengths?: string;
  improvements?: string;
  status?: "draft" | "in_review" | "completed";
}

export interface UpdateReviewDto {
  period?: string;
  startDate?: string;
  endDate?: string;
  rating?: number;
  score?: number;
  feedback?: string;
  strengths?: string;
  improvements?: string;
  status?: "draft" | "in_review" | "completed";
}

export interface KpiItem {
  id: string;
  reviewId?: string | null;
  userId: string;
  title: string;
  description?: string | null;
  targetValue: number;
  currentValue: number;
  unit: string;
  weight?: number | null;
  status: "not_started" | "in_progress" | "achieved" | "missed";
  dueDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface CreateKpiDto {
  reviewId?: string;
  userId?: string;
  title: string;
  description?: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  weight?: number;
  status?: "not_started" | "in_progress" | "achieved" | "missed";
  dueDate?: string;
}

export interface UpdateKpiDto extends Partial<CreateKpiDto> {}
