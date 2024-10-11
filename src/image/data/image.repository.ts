import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { Image } from './image.schema';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ImageRepository extends SequelizeRepository<Image> {
  constructor(
    @InjectModel(Image)
    imageRepository: typeof Image,
  ) {
    super(imageRepository);
  }
}
