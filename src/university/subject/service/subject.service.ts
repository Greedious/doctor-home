import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SubjectRepository } from '../data/subject.repository';
import { SubjectError } from './subject-error.service';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Teacher } from 'src/university/teacher/data/teacher.schema';
import { TaskService } from 'src/university/task/service/task.service';
import { GroupSchedule } from 'src/university/group/data/group.schema';
import { GroupService } from 'src/university/group/service/group.service';
import { Chair } from 'src/university/chair/data/chair.schema';

@Injectable()
export class SubjectService {
  constructor(
    private readonly subjectRepository: SubjectRepository,
    private readonly subjectError: SubjectError,
    private readonly taskService: TaskService,
    private readonly groupService: GroupService,
  ) {}

  async findOne(id: number) {
    return await this.subjectRepository.findOne({
      where: { id },
      error: this.subjectError.notFound(),
    });
  }

  async checkSubjects(ids: number[]) {
    const subjects = await this.subjectRepository.count({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });

    if (subjects !== ids.length) {
      throw new HttpException(
        this.subjectError.notFound(),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findFreeSubjects() {
    const freeSubjects = await this.subjectRepository.findAll({
      include: [{ model: Teacher, required: false }],
      where: {
        $teachers$: {
          [Op.is]: null,
        },
      },
    });
    return freeSubjects;
  }

  async checkEachSubjectHasAtLeastOneTask() {
    const tasksSubjectIds =
      (await this.taskService.getUniqueSubjectIds()) as number[];

    const subjects = await this.subjectRepository.findAll({
      options: { attributes: ['id'] },
    });

    const cnt = new Map<number, number>();
    for (const subject of subjects) {
      cnt[subject.id]++;
    }
    for (const id of tasksSubjectIds) {
      cnt[id]--;
    }

    for (const [key, value] of cnt) {
      if (value > 0) {
        throw new HttpException(
          this.subjectError.subjectHasNoAssignedTask(),
          HttpStatus.FORBIDDEN,
        );
      }
    }
    return;
  }

  async subjectsInYear(yearId: number) {
    const subjects = await this.subjectRepository.findAll({
      where: { yearId },
    });
    return subjects;
  }

  async checkNoFreeSubjects() {
    const freeSubjects = await this.findFreeSubjects();
    if (freeSubjects.length) {
      throw new HttpException(
        this.subjectError.subjectHasNoTeacher(),
        HttpStatus.FORBIDDEN,
      );
    }
    return;
  }

  async checkEachSubjectHasAtLeastOneChair() {
    const subjects = await this.subjectRepository.findAll({
      include: [{ model: Chair, required: false }],
      where: { $chair$: null },
    });
    if (subjects.length) {
      throw new HttpException(
        this.subjectError.subjectHasNoChairs(),
        HttpStatus.FORBIDDEN,
      );
    }
    return;
  }

  async checkEverySubjectHasGroupSchedule() {
    // checks every subject has schedule for each group in same year as the subject's year
    const subjects = await this.subjectRepository.findAll({
      include: [{ model: GroupSchedule, attributes: ['groupId'] }],
    });
    for (const subject of subjects) {
      const cnt = new Map<number, number>();

      const groupsInSameYearOfSubject = await this.groupService.groupsInYear(
        subject.yearId,
      );

      const groupsIds = subject.groupSchedules.map(
        (schedule) => schedule.groupId,
      );

      for (const group of groupsInSameYearOfSubject) {
        cnt[group.id]++;
      }
      for (const id of groupsIds) {
        cnt[id]--;
      }

      for (const [key, value] of cnt) {
        if (value > 0) {
          throw new HttpException(
            this.subjectError.subjectHasMissingSchedules(),
            HttpStatus.FORBIDDEN,
          );
        }
      }
    }
    return;
  }
}
