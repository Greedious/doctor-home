import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { Appointment } from './appointment.schema';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AppointmentError } from '../service/appointment-error.service';

@Injectable()
export class AppointmentRepository extends SequelizeRepository<Appointment> {
  constructor(
    @InjectModel(Appointment)
    appointmentRepository: typeof Appointment,
    private appointmentError: AppointmentError,
  ) {
    super(appointmentRepository);
  }

  async hasConflictWithDate({
    subjectId,
    chairId,
    from,
    to,
  }: {
    subjectId: number;
    chairId: number;
    from: Date;
    to: Date;
  }) {
    const schedule = await this.findOne({
      where: {
        [Op.and]: [
          {
            subjectId,
            chairId,
          },
        ],
        [Op.or]: [
          {
            from: {
              [Op.and]: [
                {
                  [Op.gte]: from,
                },
                {
                  [Op.lte]: to,
                },
              ],
            },
          },
          {
            to: {
              [Op.and]: [
                {
                  [Op.gte]: from,
                },
                {
                  [Op.lte]: to,
                },
              ],
            },
          },
          {
            from: { [Op.gte]: from },
            to: { [Op.lte]: to },
          },
        ],
      },
    });
    if (schedule) {
      throw new HttpException(
        this.appointmentError.conflictInTime(),
        HttpStatus.CONFLICT,
      );
    }
    return;
  }
}
