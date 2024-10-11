// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { SupervisorLogRepository } from '../data/supervisor-logs.repository';
// import {
//   CreateSupervisorLogRequest,
//   UpdateSupervisorLogRequest,
// } from '../api/dto/request';
// import { SupervisorLogError } from './supervisor-logs-error.service';
// import { WhereOptions } from 'sequelize';
// import { SupervisorLog } from '../data/supervisor-logs.schema';
// import { orderCriteria } from 'package/utils/methods';
// import { Params } from 'package/component/params/params';
// import { TeacherRepository } from 'src/university/teacher/data/teacher.repository';

// @Injectable()
// export class SupervisorLogDashboardService {
//   constructor(
//     private specialtyRepository: SupervisorLogRepository,
//     private teacherRepository: TeacherRepository,
//     private specialtyError: SupervisorLogError,
//   ) {}

//   async canDelete(id: number) {
//     const teacher = await this.teacherRepository.findOne({
//       where: { specialtyId: id },
//     });

//     if (teacher) {
//       throw new HttpException(
//         this.specialtyError.specialtyCannotDelete(),
//         HttpStatus.BAD_REQUEST,
//       );
//     }
//   }

//   async findOne({ id }: Params) {
//     const specialty = await this.specialtyRepository.findOne({
//       where: { id },
//       error: this.specialtyError.notFound(),
//     });
//     return specialty;
//   }
//   async findOneById(id: number) {
//     const specialty = await this.specialtyRepository.findOne({
//       where: { id },
//       error: this.specialtyError.notFound(),
//     });
//     return specialty;
//   }

//   async findAll(
//     filters: WhereOptions<SupervisorLog>,
//     pagination: { limit: number; skip: number },
//   ) {
//     const { limit, skip } = pagination;
//     const supervisorLogs = await this.specialtyRepository.findAndCount({
//       where: filters,
//       options: { limit, offset: skip, order: orderCriteria() },
//     });
//     return supervisorLogs;
//   }

//   async create(body: CreateSupervisorLogRequest) {
//     const created = await this.specialtyRepository.create({
//       doc: body,
//     });
//     return { id: created.id };
//   }

//   async update(body: UpdateSupervisorLogRequest, id: number) {
//     const specialty = await this.findOneById(id);
//     await specialty.update({
//       ...body,
//     });
//     return;
//   }

//   async delete(id: number) {
//     const specialty = await this.findOneById(id);
//     await specialty.destroy();
//     return;
//   }
// }
