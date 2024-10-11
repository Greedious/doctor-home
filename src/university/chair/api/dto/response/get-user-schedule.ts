import { getWeekDayName } from 'src/shared/types/week-days';
import { ChairStudent } from 'src/university/chair/data/chair.schema';
import { Student } from 'src/university/student/data/student.schema';

export interface IGetUserScheduleResponse {
  subject: { id: number; name: string };
  chair: { id: number; name: string };
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  } | null;
}

export class GetUserScheduleResponse {
  subject: { id: number; name: string };
  chair: { id: number; name: string };
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  } | null;

  constructor({
    languageKey,
    chairStudent,
  }: {
    chairStudent: ChairStudent;
    languageKey: string;
  }) {
    this.subject = {
      id: chairStudent.subjectId,
      name: chairStudent.subject.name[languageKey],
    };

    this.chair = {
      id: chairStudent.chairId,
      name: chairStudent.chair.name[languageKey],
    };

    this.schedule = chairStudent.subject?.groupSchedules?.[0]
      ? {
          day: getWeekDayName(
            chairStudent.subject.groupSchedules?.[0].dayOfWeek,
          ),
          startTime: chairStudent.subject.groupSchedules?.[0].startTime,
          endTime: chairStudent.subject.groupSchedules?.[0].endTime,
        }
      : null;
  }

  toObject(): IGetUserScheduleResponse {
    return {
      subject: this.subject,
      chair: this.chair,
      schedule: this.schedule,
    };
  }
}
