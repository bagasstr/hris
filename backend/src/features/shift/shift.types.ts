export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  graceTime?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateShiftDto {
  name: string;
  startTime: string;
  endTime: string;
  graceTime?: number;
}

export interface UpdateShiftDto {
  name?: string;
  startTime?: string;
  endTime?: string;
  graceTime?: number;
}
