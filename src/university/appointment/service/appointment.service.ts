import { Injectable } from '@nestjs/common';
import { AppointmentRepository } from '../data/appointment.repository';
import { AppointmentError } from './appointment-error.service';
import { WhereOptions } from 'sequelize';
import { Appointment } from '../data/appointment.schema';

@Injectable()
export class AppointmentService {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private appointmentError: AppointmentError,
  ) {}

  async findOne(id: number, shouldHavePatient?: boolean) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      error: this.appointmentError.notFound(),
    });
    if (shouldHavePatient && !appointment.patientId) {
      throw this.appointmentError.appointmentDoesNotHavePatient();
    }
    return appointment;
  }

  async countAppointments(whereOptions: WhereOptions<Appointment>) {
    const count = await this.appointmentRepository.count({
      where: whereOptions,
    });
    return count;
  }
}
