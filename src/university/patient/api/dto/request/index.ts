import mongoose from 'mongoose';
import { GetByCriteria } from 'package/pagination/dto';
import { PatientStatus } from 'src/university/patient/data/patient.schema';

export class Answer {
  question: string;
  answer: boolean;
}
export class CreatePatientRequest {
  nationalId?: string;
  name: string;
  phoneNumber: string;
  address?: string;
  availableTime: string;
  task: mongoose.Types.ObjectId;
  previousDiseases?: string;
  previousDentalDiseases?: string;
  subjectId: number;
  studentId: number;
  teacherId?: number;
  attachmentsIds: number[];
  answers: Answer[];
}

export class UpdatePatientRequest {
  nationalId?: string;
  name?: string;
  phoneNumber?: string;
  address?: string;
  availableTime?: string;
  task?: mongoose.Types.ObjectId;
  previousDiseases?: string;
  previousDentalDiseases?: string;
  status?: PatientStatus;
  subjectId?: number;
  studentId?: number;
  teacherId?: number;
  attachmentsIds: number[];
}

export class GetAllPatientsDashboardQuery extends GetByCriteria {
  search?: string;
}

export class GetAllPatientsMobileQuery extends GetByCriteria {
  search?: string;
}
