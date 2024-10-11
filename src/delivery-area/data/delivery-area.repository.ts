import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { DeliveryArea } from './delivery-area.schema';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class DeliveryAreaRepository extends SequelizeRepository<DeliveryArea> {
  constructor(
    @InjectModel(DeliveryArea)
    deliveryAreaRepository: typeof DeliveryArea,
  ) {
    super(deliveryAreaRepository);
  }
}
