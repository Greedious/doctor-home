import { Injectable } from '@nestjs/common';
import { Params } from 'package/component/params/params';
import { DeliveryAreaError } from './delivery-area-error.service';
import { DeliveryAreaRepository } from '../data/delivery-area.repository';

@Injectable()
export class DeliveryAreaMobileService {
  constructor(
    private deliveryAreaRepository: DeliveryAreaRepository,
    private deliveryAreaError: DeliveryAreaError,
  ) {}

  async findOneById(id: number) {
    const deliveryArea = await this.deliveryAreaRepository.findOne({
      where: { id },
      error: this.deliveryAreaError.notFound(),
    });
    return deliveryArea;
  }

  async findOne({ id }: Params) {
    const deliveryArea = await this.findOneById(id);
    return deliveryArea;
  }

  async findAll() {
    const deliveryArea = await this.deliveryAreaRepository.findAll({});

    return deliveryArea;
  }
}
