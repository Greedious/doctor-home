import { Injectable } from '@nestjs/common';
import { MarkRepository } from '../data/mark.repository';
import { MarkError } from './mark-error.service';
import { Subject } from 'src/university/subject/data/subject.schema';
import { Student } from 'src/university/student/data/student.schema';

@Injectable()
export class MarkDashboardService {
  constructor(
    private markRepository: MarkRepository,
    private marError: MarkError,
  ) {}

  async findMarks(studentId: number) {
    const marks = await this.markRepository.findAndCount({
      include: [Subject, Student],
      where: { studentId },
    });
    return marks;
  }
}
