import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppointmentRepository } from '../data/appointment.repository';
import { AppointmentError } from './appointment-error.service';
import { CreateAppointmentRequest } from '../api/dto/request';
import { GroupScheduleRepository } from 'src/university/group/data/group.repository';
import { GroupError } from 'src/university/group/service/group-error.service';
import { Group, GroupSchedule } from 'src/university/group/data/group.schema';
import { WhereOptions } from 'sequelize';
import { IUser } from 'src/shared/types/user';
import { Params } from 'package/component/params/params';
import { Student } from 'src/university/student/data/student.schema';
import { Subject } from 'src/university/subject/data/subject.schema';
import { Chair } from 'src/university/chair/data/chair.schema';
import { Appointment } from '../data/appointment.schema';
import { GetByCriteria } from 'package/pagination/dto';
import { myDayjs } from 'package/utils/my-dayjs';

@Injectable()
export class AppointmentMobileService {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private groupScheduleRepository: GroupScheduleRepository,
    private groupScheduleError: GroupError,
    private appointmentError: AppointmentError,
  ) {}

  async findOneById(id: number) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      error: this.appointmentError.notFound(),
    });
    return appointment;
  }

  async create(body: CreateAppointmentRequest, user: IUser) {
    const appointment = await this.appointmentRepository.create({
      doc: {
        ...body,
        studentId: user.student,
      },
    });

    return {
      id: appointment.id,
    };
  }

  async validateDate(body: CreateAppointmentRequest, groupId: number) {
    console.log({ subjectId: body.subjectId, groupId });
    const schedule = await this.groupScheduleRepository.findOne({
      where: {
        subjectId: body.subjectId,
        groupId,
      },
      error: this.groupScheduleError.notFoundGroupSchedule(),
    });
    console.log({
      scheduleDay: schedule.dayOfWeek,
      fromDay: new Date(body.from).getDay(),
      toDay: new Date(body.to).getDay(),
    });
    if (!this.inAllowedDate(schedule, new Date(body.from), new Date(body.to))) {
      throw new HttpException(
        this.appointmentError.notInAllowedTime(),
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.appointmentRepository.hasConflictWithDate({
      subjectId: body.subjectId,
      chairId: body.chairId,
      from: body.from,
      to: body.to,
    });
  }

  async findOne({ id }: Params, studentId: number) {
    const appointment = await this.appointmentRepository.findOne({
      where: {
        id,
        studentId,
      },
      include: [Student, Subject, Chair],
      error: this.appointmentError.notFound(),
    });
    return appointment;
  }

  async findAll(
    filter: WhereOptions<Appointment>,
    { skip, limit }: GetByCriteria,
  ) {
    const appointments = await this.appointmentRepository.findAndCount({
      where: filter,
      options: { offset: skip, limit },
      // order
      include: [{ model: Student, include: [Group] }, Chair, Subject],
    });
    return appointments;
  }

  async getNonAvailableDatesForChair(
    filter: WhereOptions<Appointment>,
    {
      subjectId,
      chairId,
    }: {
      subjectId: number;
      chairId: number;
    },
  ) {
    const appointments = await this.appointmentRepository.findAll({
      where: {
        ...filter,
        subjectId,
        chairId,
      },
    });

    return appointments;
  }

  inAllowedDate(schedule: GroupSchedule, from: Date, to: Date) {
    return !(
      schedule.dayOfWeek !== from.getDay() ||
      schedule.dayOfWeek !== to.getDay() ||
      schedule.startTime > myDayjs(from).format('HH:mm:ss') ||
      schedule.endTime < myDayjs(to).format('HH:mm:ss')
    );
  }
}
