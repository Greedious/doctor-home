import { GroupSchedule } from 'src/university/group/data/group.schema';
import { IGetByIdSubjectResponse } from 'src/university/subject/api/dto/response/get-by-id-subject.dto';

export interface IGetGroupSchedulesDashboardResponse {
  subject: {
    id: number;
    name: string;
    season: number;
  };
  group: {
    id: number;
    name: string;
  };
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export class GetGroupSchedulesDashboardResponse {
  subject: {
    id: number;
    name: string;
    season: number;
  };
  group: {
    id: number;
    name: string;
  };
  dayOfWeek: number;
  startTime: string;
  endTime: string;

  constructor({
    groupSchedule,
    languageKey,
  }: {
    groupSchedule: GroupSchedule;
    languageKey: string;
  }) {
    this.subject = {
      id: groupSchedule.subjectId,
      name: groupSchedule.subject.name[languageKey],
      season: groupSchedule.subject.season,
    };

    this.group = {
      id: groupSchedule.groupId,
      name: groupSchedule.group.name[languageKey],
    };

    this.dayOfWeek = groupSchedule.dayOfWeek;
    this.startTime = groupSchedule.startTime;
    this.endTime = groupSchedule.endTime;
  }

  toObject(): IGetGroupSchedulesDashboardResponse {
    return {
      subject: this.subject,
      group: this.group,
      dayOfWeek: this.dayOfWeek,
      startTime: this.startTime,
      endTime: this.endTime,
    };
  }
}
