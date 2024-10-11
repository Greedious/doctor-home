import { GetByCriteria } from 'package/pagination/dto';
import { language } from 'package/utils/language/language';

export class CreateAppointmentRequest {
  subjectId: number;
  from: Date;
  to: Date;
  // not from request
  chairId?: number;
  patientId: number;
}

export class UpdateAppointment {
  id?: number;
  appointment?: language;
}

export class GetOneAppointment {
  studentId?: number;
}

export class GetAllAppointments extends GetByCriteria {
  past: boolean;
}
