import { Injectable } from '@nestjs/common';
import * as joi from 'joi';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { id } from 'package/validation/schema';
import { EditProfileDoctorUser } from 'src/account/doctor/api/dto/request';
import { EditProfileOperatorUser } from 'src/account/operator/api/dto/request';

@Injectable()
export class UserValidation {
  editProfileDoctorUser({ body }: { body: EditProfileDoctorUser }) {
    const editProfileDoctorUserSchema = joi.object<EditProfileDoctorUser>({
      id,
      phoneNumber: joi.string().required().min(10),
      firstName: joi.string().max(16).required(),
      lastName: joi.string().max(16).required(),
    });
    return new JoiValidationPipe(editProfileDoctorUserSchema).transform(body);
  }

  editProfileOperatorUser({ body }: { body: EditProfileOperatorUser }) {
    const editProfileOperatorUserSchema = joi.object<EditProfileOperatorUser>({
      id,
      fullName: joi.string().max(16).required(),
    });
    return new JoiValidationPipe(editProfileOperatorUserSchema).transform(body);
  }
}
