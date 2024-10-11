import { Module } from '@nestjs/common';
import { Doctor } from './data/doctor.schema';
import { DoctorRepository } from './data/doctor.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { DoctorMobileService } from './service/doctor-mobile.service';

@Module({
  imports: [SequelizeModule.forFeature([Doctor])],
  providers: [DoctorRepository, DoctorRepository, DoctorMobileService],
  controllers: [],
  exports: [DoctorRepository, DoctorMobileService],
})
export class DoctorModule {}
