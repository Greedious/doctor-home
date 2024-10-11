import { Module } from '@nestjs/common';
import { ImageController } from './api/controller/image.controller';
import { ImageService } from './service/image.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Image } from './data/image.schema';
import { ImageRepository } from './data/image.repository';

@Module({
  imports: [SequelizeModule.forFeature([Image])],
  controllers: [ImageController],
  providers: [ImageService, ImageRepository],
  exports: [ImageService],
})
export class ImageModule {}
