import { Injectable } from '@nestjs/common';
import { DeliveryAreaRepository } from '../data/delivery-area.repository';
import { DeliveryAreaError } from './delivery-area-error.service';

@Injectable()
export class DeliveryAreaService {
  constructor(
    private deliveryAreaRepository: DeliveryAreaRepository,
    private deliveryAreaError: DeliveryAreaError,
  ) {}

  async findOneById(id: number) {
    return await this.deliveryAreaRepository.findOne({
      where: { id },
      error: this.deliveryAreaError.notFound(),
    });
  }
}
