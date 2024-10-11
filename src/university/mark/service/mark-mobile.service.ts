import { Injectable } from '@nestjs/common';
import { StudentService } from 'src/university/student/service/student.service';
import { MarkRepository } from '../data/mark.repository';
import { MarkError } from './mark-error.service';

@Injectable()
export class MarkMobileService {
  constructor(
    private readonly studentService: StudentService,
    private readonly markRepository: MarkRepository,
    private readonly markError: MarkError,
  ) {}

  async setMark({
    mark,
    studentId,
    subjectId,
  }: {
    studentId: number;
    mark: number;
    subjectId: number;
  }) {
    const oldMark = await this.markRepository.findOne({
      where: { studentId, subjectId },
      throwError: false,
    });
    if (oldMark) {
      throw this.markError.studentAlreadyHasMark();
    }
    return await this.markRepository.create({
      doc: { studentId, subjectId, mark },
    });
  }
}
