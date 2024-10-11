import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DoctorRepository } from '../data/doctor.repository';
import { User } from 'src/account/user/data/user.schema';
import { UserError } from 'src/account/user/service/user-error.service';
import { Transaction } from 'sequelize';
import mongoose from 'mongoose';
import { SupervisorService } from 'src/university/supervisor/service/supervisor.service';

@Injectable()
export class DoctorService {
  constructor(
    private readonly doctorRepository: DoctorRepository,
    private readonly supervisorService: SupervisorService,
    private readonly userError: UserError,
  ) {}

  async findOneById(id: number) {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      error: this.userError.notFound(),
    });
    return doctor;
  }
  async findSupervisorDoctor(doctorId: number) {
    const doctor = await this.findOneById(doctorId);
    const supervisor = await this.supervisorService.findOneById(
      doctor.supervisorId,
    );
    return supervisor;
  }

  async registerUniversityByPhoneNumber(
    phoneNumber: string,
    body: {
      teacherId?: number;
      studentId?: number;
      supervisorId?: number;
    },
    transaction?: Transaction,
  ) {
    const user = await this.doctorRepository.findOne({
      where: {},
      include: [{ model: User, where: { phoneNumber } }],
      error: this.userError.notFound(),
    });
    if (user.teacherId || user.studentId || user.supervisorId) {
      throw new HttpException(
        this.userError.userAlreadyExist(),
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log(body);
    await user.update(body, { transaction });

    return user;
  }
}
