import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { InjectModel } from '@nestjs/sequelize';
import { Doctor } from './doctor.schema';

@Injectable()
export class DoctorRepository extends SequelizeRepository<Doctor> {
  constructor(
    @InjectModel(Doctor)
    doctorRepository: typeof Doctor,
  ) {
    super(doctorRepository);
  }
}
