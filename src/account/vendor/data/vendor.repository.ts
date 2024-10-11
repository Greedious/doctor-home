import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { InjectModel } from '@nestjs/sequelize';
import { Vendor } from './vendor.schema';

@Injectable()
export class VendorRepository extends SequelizeRepository<Vendor> {
  constructor(
    @InjectModel(Vendor)
    vendorRepository: typeof Vendor,
  ) {
    super(vendorRepository);
  }
}
