import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/account/user/service/user.service';
import { AuthError } from './auth-error.service';
import { CreateDoctorRequest, OtpRequest } from '../api/dto/request';
import { RoleService } from 'src/role/service/role.service';
import { Types, User } from 'src/account/user/data/user.schema';
import { JwtService } from '@nestjs/jwt';
import { buildJWTPayload } from 'package/strategies/jwt/jwt-payload';
import { DoctorMobileService } from 'src/account/doctor/service/doctor-mobile.service';
import { Transaction } from 'sequelize';

@Injectable()
export class AuthMobileService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
    private readonly authError: AuthError,
    private readonly doctorService: DoctorMobileService,
  ) {}
  async validateAccountMobile(phoneNumber: string, otp: string): Promise<any> {
    const account = await this.userService.findByPhoneNumber(phoneNumber);
    if (!account)
      throw new HttpException(
        this.authError.loginFailed(),
        HttpStatus.NOT_FOUND,
      );
    if (account.otpCode?.code !== otp) {
      throw new HttpException(
        this.authError.loginFailed(),
        HttpStatus.BAD_REQUEST,
      );
    }
    return account;
  }

  async login(user: User) {
    const jwtPayload = buildJWTPayload(user);
    const student = jwtPayload.student;
    const teacher = jwtPayload.teacher;
    const supervisor = jwtPayload.supervisor;
    const response = {
      accessToken: this.jwtService.sign(jwtPayload),
      user: {
        id: student ? student : teacher ? teacher : jwtPayload.id,
        role: student
          ? Types.STUDENT
          : teacher
            ? Types.TEACHER
            : supervisor
              ? Types.SUPERVISOR
              : 'USER',
        firstName: user.doctor.firstName,
        lastName: user.doctor.lastName,
        phoneNumber: user.phoneNumber,
      },
    };
    return response;
  }

  async isRegistered(username: string) {
    const user = await this.userService.findByUsername(username, false);
    if (user) {
      throw new HttpException(
        this.authError.userIsRegistered(),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async isNotRegistered(phoneNumber: string) {
    const user = await this.userService.findByPhoneNumber(phoneNumber);

    if (!user) {
      throw new HttpException(
        this.authError.userIsNotRegistered(),
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(body: CreateDoctorRequest, transaction: Transaction) {
    const role = await this.roleService.findDoctorRole();
    const user = await this.userService.createDoctor(
      {
        role,
        phoneNumber: body.phoneNumber,
      },
      transaction,
    );

    const doctor = await this.doctorService.create(
      { ...body, userId: user.id },
      transaction,
    );
    user.set('doctorId', doctor.id);
    await user.save({ transaction });
    return user;
  }

  async askForOtp(body: OtpRequest, otpCode: string) {
    await this.userService.addOtp(body.phoneNumber, otpCode);
  }
}
