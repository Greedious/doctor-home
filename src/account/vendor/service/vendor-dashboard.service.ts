import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { VendorRepository } from '../data/vendor.repository';
import {
  CreateVendor,
  CreateVendorUser,
  EditProfileVendor,
} from '../api/dto/request';
import { UserService } from 'src/account/user/service/user.service';
import { RoleService } from 'src/role/service/role.service';
import { GetByCriteria } from 'package/pagination/dto';
import { User } from 'src/account/user/data/user.schema';
import { Role } from 'src/role/data/role.schema';
import { Transaction } from 'sequelize';
import { getLimitAndOffset } from 'package/utils/methods';

@Injectable()
export class VendorDashboardService {
  constructor(
    private vendorRepository: VendorRepository,
    private roleService: RoleService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async findByUserId(id: number) {
    const vendor = await this.vendorRepository.findOne({
      where: { userId: id },
      error: { message: 'Vendor not found', code: HttpStatus.NOT_FOUND },
    });
    return vendor;
  }
  async validateRole() {
    return await this.roleService.findVendorRole();
  }

  async createUser(body: CreateVendorUser, transaction: Transaction) {
    return await this.userService.createVendor(body, transaction);
  }

  async findAll({ vendorFilter, userFilter }, query: GetByCriteria) {
    const { limit, offset } = getLimitAndOffset(query);
    return await this.vendorRepository.findAndCount({
      where: vendorFilter,
      options: { offset, limit },
      include: [{ model: User, where: userFilter, include: [Role] }],
    });
  }

  async create(body: CreateVendor, transaction: Transaction) {
    return await this.vendorRepository.create({
      doc: {
        fullName: body.fullName,
        userId: body.user.id,
      },
      options: { transaction },
    });
  }

  async editProfile(body: EditProfileVendor) {
    await this.vendorRepository.update({
      where: { id: body.id },
      update: { fullName: body.fullName },
    });
    return;
  }
  // async update(body: UpdateVendor, { id }: Params) {
  //   await this.vendorRepository.findOneAndUpdate({
  //     where: { id, user: { isActive: !body.isActive } },
  //     update: {  },
  //   });
  // }
}
