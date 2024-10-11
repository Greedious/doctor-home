import { Injectable } from '@nestjs/common';
import { AddressRepository } from '../data/address.repository';
import { UserRepository } from 'src/account/user/data/user.repository';
import { CreateAddress } from '../api/dto/request';
import { AddressError } from './address-error.service';

@Injectable()
export class AddressMobileService {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly addressError: AddressError,
    private readonly userRepository: UserRepository,
  ) {}

  async findOne(id: number, userId: number) {
    // TODO: move parameters them to class
    const address = await this.addressRepository.findOne({
      where: { id, userId },
      error: this.addressError.notFound(),
    });

    return address;
  }
  async findForUser(user: number) {
    return await this.addressRepository.findAll({ where: { userId: user } });
  }

  async create(body: CreateAddress) {
    // it will automatically throw an error if the user does not found
    await this.userRepository.findOne({
      where: { id: body.userId },
      throwError: true,
    });

    const created = await this.addressRepository.create({
      doc: body,
    });
    return created;
  }

  async delete(body: { id: number; userId: number }) {
    const address = await this.addressRepository.findOne({
      where: { id: body.id, userId: body.userId },
      error: this.addressError.notFound(),
    });

    await address.destroy();
    return;
  }
}
