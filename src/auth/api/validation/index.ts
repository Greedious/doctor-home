import { Injectable } from '@nestjs/common';
import * as joi from 'joi';
import { LoginDto } from '../dto';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import {
  CreateDoctorRequest,
  DoctorLoginRequest,
  OtpRequest,
} from '../dto/request';
import { validationSchema } from 'package/validation';

@Injectable()
export class AuthValidation {
  constructor() {}

  login(body: LoginDto) {
    const loginSchema = joi.object<LoginDto>({
      username: joi.string().required().min(3),
      password: joi.string().min(8).required(),
    });
    return new JoiValidationPipe(loginSchema).transform(body);
  }

  mobileLogin({ body }: { body: DoctorLoginRequest }) {
    const loginSchema = joi.object<DoctorLoginRequest>({
      phoneNumber: validationSchema.phoneNumber().required(),
      otp: joi.string().min(4).max(4).required(),
    });
    return new JoiValidationPipe(loginSchema).transform(body);
  }

  askForOtp({ body }: { body: OtpRequest }) {
    const otp = joi.object({
      phoneNumber: validationSchema.phoneNumber().required(),
    });
    return new JoiValidationPipe(otp).transform(body);
  }

  signupMobile({ body }: { body: CreateDoctorRequest }) {
    const create = joi.object({
      phoneNumber: validationSchema.phoneNumber().required(),
      firstName: joi.string().required(),
      lastName: joi.string().required(),
    });
    return new JoiValidationPipe(create).transform(body);
  }
}
