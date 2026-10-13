export interface JobPosting {
  id: string;
  title: string;
  departmentId?: string | null;
  positionId?: string | null;
  employmentType: string;
  location?: string | null;
  description: string;
  requirements?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  status: "draft" | "open" | "closed";
  deadline?: string | null;
  createdAt?: string;
  updatedAt?: string;
  department?: { id: string; name: string } | null;
  position?: { id: string; name: string } | null;
  applicants?: Applicant[];
  _count?: {
    applicants?: number;
  };
}

export interface CreateJobPostingDto {
  title: string;
  departmentId?: string;
  positionId?: string;
  employmentType?: string;
  location?: string;
  description: string;
  requirements?: string;
  salaryMin?: number;
  salaryMax?: number;
  status?: "draft" | "open" | "closed";
  deadline?: string;
}

export interface UpdateJobPostingDto extends Partial<CreateJobPostingDto> {}

export interface Applicant {
  id: string;
  jobPostingId: string;
  name: string;
  email: string;
  phone?: string | null;
  resumeUrl?: string | null;
  portfolioUrl?: string | null;
  coverLetter?: string | null;
  status: "applied" | "screening" | "interview" | "offered" | "hired" | "rejected";
  notes?: string | null;
  appliedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  jobPosting?: {
    id: string;
    title: string;
  };
  interviews?: Interview[];
}

export interface CreateApplicantDto {
  jobPostingId: string;
  name: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  coverLetter?: string;
  notes?: string;
}

export interface UpdateApplicantStatusDto {
  status: "applied" | "screening" | "interview" | "offered" | "hired" | "rejected";
  notes?: string;
}

export interface Interview {
  id: string;
  applicantId: string;
  interviewerId?: string | null;
  scheduledAt: string;
  type: "online" | "onsite";
  locationOrLink?: string | null;
  notes?: string | null;
  feedback?: string | null;
  status: "scheduled" | "completed" | "cancelled";
  result?: "pending" | "passed" | "failed" | null;
  createdAt?: string;
  updatedAt?: string;
  applicant?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateInterviewDto {
  applicantId: string;
  interviewerId?: string;
  scheduledAt: string;
  type?: "online" | "onsite";
  locationOrLink?: string;
  notes?: string;
}

export interface UpdateInterviewDto {
  scheduledAt?: string;
  type?: "online" | "onsite";
  locationOrLink?: string;
  notes?: string;
  feedback?: string;
  status?: "scheduled" | "completed" | "cancelled";
  result?: "pending" | "passed" | "failed";
}
