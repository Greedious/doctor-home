import { Module, forwardRef } from '@nestjs/common';
import { Doctor } from './data/doctor.schema';
import { DoctorRepository } from './data/doctor.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { DoctorMobileService } from './service/doctor-mobile.service';
import { DoctorService } from './service/doctor.service';
import { UserModule } from '../user/user.module';
import { SupervisorModule } from 'src/university/supervisor/supervisor.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Doctor]),
    forwardRef(() => UserModule),
    SupervisorModule,
  ],
  providers: [DoctorRepository, DoctorMobileService, DoctorService],
  controllers: [],
  exports: [DoctorRepository, DoctorMobileService, DoctorService],
})
export class DoctorModule {}
