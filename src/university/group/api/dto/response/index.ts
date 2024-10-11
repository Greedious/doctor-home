export class CreateGroupScheduleRequest {
  subjectId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export class UpdateGroupScheduleRequest {
  subjectId: number;
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
}
