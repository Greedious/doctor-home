import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { UniversityOperatorRepository } from '../data/operator.repository';
import {
  CreateUniversityOperator,
  CreateUniversityOperatorUser,
  EditProfileUniversityOperator,
} from '../api/dto/request';
import { RoleService } from 'src/role/service/role.service';
import { GetByCriteria } from 'package/pagination/dto';
import { User } from 'src/account/user/data/user.schema';
import { Role } from 'src/role/data/role.schema';
import { UserDashboardService } from 'src/account/user/service/user-dasboard.service';
import { Transaction } from 'sequelize';

@Injectable()
export class UniversityOperatorDashboardService {
  constructor(
    private universityOperatorRepository: UniversityOperatorRepository,
    private roleService: RoleService,
    @Inject(forwardRef(() => UserDashboardService))
    private readonly userDashboardService: UserDashboardService,
  ) {}

  async validateRole(role: number) {
    return await this.roleService.findUniversityAdminRole(role);
  }

  async createUser(
    body: CreateUniversityOperatorUser,
    transaction: Transaction,
  ) {
    return await this.userDashboardService.createUniversityOperator(
      body,
      transaction,
    );
  }

  async findOneById(id: number) {
    const universityOperator = await this.universityOperatorRepository.findOne({
      where: { id },
      error: {
        message: 'UniversityOperator not found',
        code: HttpStatus.NOT_FOUND,
      },
    });
    return universityOperator;
  }

  async findAll(
    { universityOperatorFilter, userFilter },
    query: GetByCriteria,
  ) {
    let limit = undefined,
      offset = undefined;
    if (query.needPagination) {
      limit = query.limit;
      offset = query.skip;
    }
    return await this.universityOperatorRepository.findAndCount({
      where: universityOperatorFilter,
      options: { offset, limit },
      include: [{ model: User, where: userFilter, include: [Role] }],
    });
  }

  async create(
    body: CreateUniversityOperator,
    transaction: Transaction | null,
  ) {
    console.log(body);
    return await this.universityOperatorRepository.create({
      doc: {
        fullName: body.fullName,
        userId: body.user.id,
      },
      options: { transaction },
    });
  }

  async editProfile(body: EditProfileUniversityOperator) {
    await this.universityOperatorRepository.update({
      where: { id: body.id },
      update: { fullName: body.fullName },
    });
    return;
  }
  // async update(body: UpdateUniversityOperator, { id }: Params) {
  //   await this.universityOperatorRepository.findOneAndUpdate({
  //     where: { id, user: { isActive: !body.isActive } },
  //     update: {  },
  //   });
  // }
}
