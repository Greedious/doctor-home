import {
  GetGroupDashboardResponse,
  IGroupDashboardResponse,
} from 'src/university/group/api/dto/response/get-group-dashboard.response';
import { TeacherSubject } from 'src/university/teacher/data/teacher.schema';

export interface IGetTeacherSubjects {
  subjectId: number;
  name: string;
  groupCount: number;
  groups: IGroupDashboardResponse[];
}

export class GetTeacherSubjects {
  subjectId: number;
  name: string;
  groupCount: number;
  groups: IGroupDashboardResponse[];

  constructor({
    teacherSubject,
    languageKey,
  }: {
    teacherSubject: TeacherSubject;
    languageKey: string;
  }) {
    this.subjectId = teacherSubject.subjectId;
    this.name = teacherSubject.subject.name[languageKey];
    this.groupCount = teacherSubject.supervisedGroups.length;
    const toAssignGroups: IGroupDashboardResponse[] = [];

    for (const supervisedGroup of teacherSubject.supervisedGroups) {
      toAssignGroups.push(
        new GetGroupDashboardResponse({
          group: supervisedGroup.group,
          languageKey,
        }),
      );
    }
    this.groups = toAssignGroups;
  }

  toObject(): IGetTeacherSubjects {
    return {
      subjectId: this.subjectId,
      name: this.name,
      groupCount: this.groupCount,
      groups: this.groups,
    };
  }
}
