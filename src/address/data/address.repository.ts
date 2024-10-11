import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { InjectModel } from '@nestjs/sequelize';
import { Address } from './address.schema';

@Injectable()
export class AddressRepository extends SequelizeRepository<Address> {
  constructor(
    @InjectModel(Address)
    addressRepository: typeof Address,
  ) {
    super(addressRepository);
  }
}
