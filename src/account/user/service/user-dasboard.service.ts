import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import {
  CreateOperatorUser,
  CreateUniversityOperatorUser,
  EditProfileOperatorUser,
} from 'src/account/operator/api/dto/request';
import { Types } from '../data/user.schema';
import { UserRepository } from '../data/user.repository';
import { UserError } from './user-error.service';
import { Operator } from 'src/account/operator/data/operator.schema';
import { OperatorDashboardService } from 'src/account/operator/service/operator-dashboard.service';
import { Transaction } from 'sequelize';

@Injectable()
export class UserDashboardService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userError: UserError,
    @Inject(forwardRef(() => OperatorDashboardService))
    private readonly operatorDashboardService: OperatorDashboardService,
  ) {}

  async createOperator(body: CreateOperatorUser, transaction: Transaction) {
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
        type: Types.ADMIN,
        roleId: body.role,
      },
      options: {
        transaction,
      },
    });
    return user;
  }

  async createUniversityOperator(
    body: CreateUniversityOperatorUser,
    transaction: Transaction,
  ) {
    let user = await this.userRepository.findOne({
      where: { username: body.username, role: Types.UNIVERSITY_ADMIN },
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
        type: Types.UNIVERSITY_ADMIN,
        roleId: body.role,
      },
      options: {
        transaction,
      },
    });
    return user;
  }

  async editProfileOperator(body: EditProfileOperatorUser) {
    const user = await this.userRepository.findOne({
      where: { id: body.id },
      throwError: true,
      include: [Operator],
    });
    if (!user.operatorId) {
      throw new HttpException(
        'This user is not an operator',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.operatorDashboardService.editProfile({
      id: user.operatorId,
      fullName: body.fullName,
    });
    return;
  }
}
