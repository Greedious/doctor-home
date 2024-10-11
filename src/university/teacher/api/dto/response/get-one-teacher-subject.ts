import {
  GetGroupDashboardResponse,
  IGroupDashboardResponse,
} from 'src/university/group/api/dto/response/get-group-dashboard.response';
import { TeacherSubject } from 'src/university/teacher/data/teacher.schema';

export class IGetOneTeacherSubject {
  subjectId: number;
  subjectName: string;
  groups: IGroupDashboardResponse[];
}

export class GetOneTeacherSubject {
  subjectId: number;
  subjectName: string;
  groups: IGroupDashboardResponse[];

  constructor({
    teacherSubject,
    languageKey,
  }: {
    teacherSubject: TeacherSubject;
    languageKey: string;
  }) {
    this.subjectId = teacherSubject.subjectId;
    this.subjectName = teacherSubject.subject.name[languageKey];
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

  toObject(): IGetOneTeacherSubject {
    return {
      subjectId: this.subjectId,
      subjectName: this.subjectName,
      groups: this.groups,
    };
  }
}
