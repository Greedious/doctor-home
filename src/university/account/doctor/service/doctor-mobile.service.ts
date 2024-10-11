import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DoctorRepository } from '../data/doctor.repository';
import { CreateDoctorRequest } from 'src/auth/api/dto/request';
import { EditProfileDoctor } from '../api/dto/request';
import { UserRepository } from 'src/account/user/data/user.repository';
import { Doctor } from '../data/doctor.schema';
import { Transaction } from 'sequelize';

@Injectable()
export class DoctorMobileService {
  constructor(private readonly doctorRepository: DoctorRepository) {}

  async create(body: CreateDoctorRequest, transaction: Transaction) {
    const created = await this.doctorRepository.create({
      doc: body,
      options: { transaction },
    });
    return created;
  }

  async editProfile(body: EditProfileDoctor) {
    const { firstName, lastName } = body;
    await this.doctorRepository.update({
      where: { id: body.id },
      update: { firstName, lastName },
    });
    return;
  }
}
