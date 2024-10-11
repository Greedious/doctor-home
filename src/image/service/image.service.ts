import { HttpStatus, Injectable } from '@nestjs/common';
import { ImageRepository } from '../data/image.repository';
import { CreateImage } from '../api/dto';

@Injectable()
export class ImageService {
  constructor(private readonly imageRepository: ImageRepository) {}

  async findOneById(id: number) {
    const image = await this.imageRepository.findOne({
      where: { id },
      error: { message: 'Image not found', code: HttpStatus.NOT_FOUND },
    });
    return image;
  }

  async checkImages(ids: number[]) {
    return ids.every(async (id: number) => {
      return (await this.imageRepository.count({ where: { id } })) > 0;
    });
  }
  async createImage(dto: CreateImage) {
    const image = await this.imageRepository.create({
      doc: dto,
    });
    return image;
  }
}
