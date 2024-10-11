import mongoose from 'mongoose';
import { GetByCriteria } from 'package/pagination/dto';
import { language } from 'package/utils/language/language';

export class CreateSubjectRequest {
  name: language;
  season: number;
  yearId: number;
}

export class UpdateSubjectRequest {
  id?: number;
  name: language;
  season: number;
  yearId: number;
}

export class GetAllSubjectQuery extends GetByCriteria {
  search?: string;
  season?: number;
  year?: number;
}

export class GetAllSubjectMobileQuery {
  // search?: string;
  // season?: number;
  // year?: number;
}

export class GetCard {
  studentId?: number;
}

export class UpdateFields {
  fields: {
    id: mongoose.Types.ObjectId;
    value: string | boolean;
  }[];
}

export class GetNonAvailableDatesRequest {
  date: Date;
}

export class CreateNote {
  message: string;
}
