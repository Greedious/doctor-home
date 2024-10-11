import { Injectable } from '@nestjs/common';
import {
  CreateAppointmentRequest,
  UpdateAppointment,
} from '../api/dto/request';
import { Params } from 'package/component/params/params';
import { AppointmentError } from './appointment-error.service';
import { AppointmentRepository } from '../data/appointment.repository';

@Injectable()
export class AppointmentDashboardService {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private appointmentError: AppointmentError,
  ) {}

  async findOneById(id: number) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      error: this.appointmentError.notFound(),
    });
    return appointment;
  }

  async findOne({ id }: Params) {
    const appointment = await this.findOneById(id);
    return appointment;
  }

  async findAll() {
    const appointments = await this.appointmentRepository.findAll({});
    return appointments;
  }

  async delete(id: number) {
    await this.appointmentRepository.delete({
      where: { id },
    });
    return;
  }

  async create(body: CreateAppointmentRequest) {
    const appointment = await this.appointmentRepository.create({
      doc: body,
    });

    return {
      id: appointment.id,
    };
  }

  async update(body: UpdateAppointment, id: number) {
    await this.appointmentRepository.update({
      where: { id },
      update: body,
    });
  }
}
