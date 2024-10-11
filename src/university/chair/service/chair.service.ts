import { Injectable } from '@nestjs/common';
import {
  ChairRepository,
  ChairStudentRepository,
} from '../data/chair.repository';
import { ChairError } from './chair-error.service';
import { Chair } from '../data/chair.schema';

@Injectable()
export class ChairService {
  constructor(
    private readonly chairRepository: ChairRepository,
    private readonly chairStudentRepository: ChairStudentRepository,
    private readonly chairError: ChairError,
  ) {}

  async checkChair(id: number) {
    const studentChair = await this.chairStudentRepository.findOne({
      where: { id },
      error: this.chairError.notFound(),
      include: [{ model: Chair, required: true }],
    });
    return studentChair.chair;
  }

  async getChairByStudentAndSubject(studentId: number, subjectId: number) {
    return await this.chairStudentRepository.findOne({
      where: {
        studentId,
        subjectId,
      },
      error: this.chairError.notFound(),
    });
  }
}
