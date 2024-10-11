import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOperatorUser } from 'src/account/operator/api/dto/request';
import { Types } from '../data/user.schema';
import { UserError } from './user-error.service';
import {
  CreateDoctorUser,
  EditProfileDoctorUser,
} from 'src/account/doctor/api/dto/request';
import { usersData } from 'src/db/seed/users.data';
import { Operator } from 'src/account/operator/data/operator.schema';
import { Doctor } from 'src/account/doctor/data/doctor.schema';
import { UserRepository } from '../data/user.repository';
import { Role } from 'src/role/data/role.schema';
import { Privilege } from 'src/privilege/data/privilege.schema';
import { DoctorMobileService } from 'src/account/doctor/service/doctor-mobile.service';
import { pick } from 'lodash';
import { Transaction } from 'sequelize';
import { Vendor } from 'src/account/vendor/data/vendor.schema';
import { RoleService } from 'src/role/service/role.service';
import { UniversityOperator } from 'src/university/account/operator/data/operator.schema';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
    private readonly userError: UserError,
    private readonly doctorMobileService: DoctorMobileService,
  ) {}
  async seed() {
    for (const user of usersData) {
      const curUser = await this.userRepository.findOne({
        where: { builtIn: true, type: user.type },
      });
      if (curUser) continue;
      const role = await this.roleService.findByType(user.type);
      await this.userRepository.create({
        doc: {
          ...user,
          roleId: role.id,
        },
      });
    }
    return true;
  }

  async count({ isActive = true }: { isActive?: boolean }) {
    const usersCount = await this.userRepository.count({
      where: { isActive, type: Types.DOCTOR },
    });
    return usersCount;
  }

  async createVendor(body: CreateOperatorUser, transaction: Transaction) {
    let user = await this.userRepository.findOne({
      where: { username: body.username },
    });
    if (user) {
      throw new HttpException(
        this.userError.userAlreadyExist(),
        HttpStatus.BAD_REQUEST,
      );
    }
    user = await this.userRepository.create({
      doc: {
        username: body.username,
        password: body.password,
        isActive: true,
        roleId: body.role,
        type: Types.VENDOR,
      },
      options: { transaction },
    });
    console.log({ user });
    return user;
  }

  async addOtp(phoneNumber: string, otpCode?: string) {
    await this.userRepository.update({
      where: { phoneNumber, type: Types.DOCTOR },
      update: { otpCode: { code: '1234', date: new Date() } },
    });
  }

  async createDoctor(body: CreateDoctorUser, transaction: Transaction) {
    console.log('creating doctor');
    const user = await this.userRepository.create({
      doc: {
        phoneNumber: body.phoneNumber,
        isActive: true,
        type: Types.DOCTOR,
        roleId: body.role.id,
      },
    });
    return user;
  }

  async editProfileDoctor(body: EditProfileDoctorUser) {
    const user = await this.userRepository.findOne({
      where: { id: body.id },
      throwError: true,
      include: [Doctor],
    });
    if (!user.doctorId) {
      // TODO: change and create error service
      throw new HttpException(
        'This user is not a doctor',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.userRepository.update({
      where: { id: user.id },
      update: { phoneNumber: body.phoneNumber },
    });
    await this.doctorMobileService.editProfile({
      id: user.doctorId,
      ...pick(body, ['firstName', 'lastName']),
    });
    return;
  }

  async findByUsername(username: string, throwError?: boolean) {
    const user = await this.userRepository.findOne({
      where: { username },
      include: [
        { model: Operator, required: false },
        { model: Vendor, required: false },
        { model: UniversityOperator, required: false },
        { model: Role, include: [Privilege] },
      ],
      error: this.userError.notFound(),
      throwError,
    });
    return user;
  }
  async findByPhoneNumber(phoneNumber: string) {
    const user = await this.userRepository.findOne({
      where: {
        phoneNumber,
        type: Types.DOCTOR,
      },
      include: [Doctor, { model: Role, include: [Privilege] }],
    });
    return user;
  }
  async updateOperator(id: number, operatorId: number) {
    return await this.userRepository.update({
      where: { id },
      update: { operatorId },
    });
  }
  async updateUniversityOperator(id: number, universityOperatorId: number) {
    return await this.userRepository.update({
      where: { id },
      update: { universityOperatorId },
    });
  }

  // async findByUsername(u)
}
