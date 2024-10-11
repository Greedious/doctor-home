import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { OperatorRepository } from '../data/operator.repository';
import {
  CreateOperator,
  CreateOperatorUser,
  EditProfileOperator,
  EditProfileOperatorUser,
  UpdateOperator,
} from '../api/dto/request';
import { UserService } from 'src/account/user/service/user.service';
import { RoleService } from 'src/role/service/role.service';
import { GetByCriteria } from 'package/pagination/dto';
import { Params } from 'package/component/params/params';
import { User } from 'src/account/user/data/user.schema';
import { Role } from 'src/role/data/role.schema';
import { UserDashboardService } from 'src/account/user/service/user-dasboard.service';
import { Transaction } from 'sequelize';
import { OperatorError } from './operator-error.service';

@Injectable()
export class OperatorDashboardService {
  constructor(
    private operatorRepository: OperatorRepository,
    private roleService: RoleService,
    @Inject(forwardRef(() => UserDashboardService))
    private readonly userDashboardService: UserDashboardService,
    private readonly operatorError: OperatorError,
  ) {}

  async validateRole(role: number) {
    return await this.roleService.findAdminRole(role);
  }

  async createUser(body: CreateOperatorUser, transaction: Transaction) {
    return await this.userDashboardService.createOperator(body, transaction);
  }

  async findOneById(id: number) {
    const operator = await this.operatorRepository.findOne({
      where: { id },
      include: [{ model: User, include: [Role] }],
      error: this.operatorError.notFound(),
    });
    return operator;
  }

  async findAll({ operatorFilter, userFilter }, query: GetByCriteria) {
    let limit = undefined,
      offset = undefined;
    if (query.needPagination) {
      limit = query.limit;
      offset = query.skip;
    }
    return await this.operatorRepository.findAndCount({
      where: operatorFilter,
      options: { offset, limit },
      include: [{ model: User, where: userFilter, include: [Role] }],
    });
  }

  async create(body: CreateOperator, transaction: Transaction | null) {
    return await this.operatorRepository.create({
      doc: {
        fullName: body.fullName,
        userId: body.user.id,
      },
      options: { transaction },
    });
  }

  async editProfile(body: EditProfileOperator) {
    await this.operatorRepository.update({
      where: { id: body.id },
      update: { fullName: body.fullName },
    });
    return;
  }

  async delete(id: number) {
    const operator = await this.findOneById(id);
    await operator.destroy();
    return;
  }
  // async update(body: UpdateOperator, { id }: Params) {
  //   await this.operatorRepository.findOneAndUpdate({
  //     where: { id, user: { isActive: !body.isActive } },
  //     update: {  },
  //   });
  // }
}
