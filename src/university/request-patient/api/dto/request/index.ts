import mongoose from 'mongoose';
import { GetByCriteria } from 'package/pagination/dto';
import { PatientStatus } from 'src/university/patient/data/patient.schema';
export class RequestPatient {
  subjectId: number;
  task: mongoose.Types.ObjectId;
}
