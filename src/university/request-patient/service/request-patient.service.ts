import { Injectable } from '@nestjs/common';
import { RequestPatientRepository } from '../data/request-patient.repository';
import mongoose from 'mongoose';

@Injectable()
export class RequestPatientService {
  constructor(
    private readonly requestPatientRepository: RequestPatientRepository,
  ) {}

  async findSuitableStudent(payload: {
    subjectId: number;
    task: mongoose.Types.ObjectId;
  }) {
    return await this.requestPatientRepository.findSuitableStudent(payload);
  }
}
