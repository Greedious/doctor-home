import { Injectable } from '@nestjs/common';
import {
  CreateDeliveryAreaRequest,
  UpdateDeliveryArea,
} from '../api/dto/request';
import { Params } from 'package/component/params/params';
import { DeliveryAreaError } from './delivery-area-error.service';
import { DeliveryAreaRepository } from '../data/delivery-area.repository';

@Injectable()
export class DeliveryAreaDashboardService {
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

  async delete({ id }: Params) {
    await this.deliveryAreaRepository.delete({
      where: { id },
    });
    return;
  }

  async create(body: CreateDeliveryAreaRequest) {
    const deliveryArea = await this.deliveryAreaRepository.create({
      doc: body,
    });

    return {
      id: deliveryArea.id,
    };
  }

  async update(body: UpdateDeliveryArea, params: Params) {
    await this.deliveryAreaRepository.update({
      where: { id: params.id },
      update: body,
    });
  }
}
