import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ImageService } from 'src/image/service/image.service';
import imageSize from 'image-size';
import { UploadImage } from '../api/dto';
import { constructFileUrl } from 'package/utils/methods';

@Injectable()
export class UploadService {
  constructor(
    private readonly imageService: ImageService,
    private readonly configService: ConfigService,
  ) {}

  async uploadImage(file: Express.Multer.File, body: UploadImage) {
    const { height, width } = imageSize(file.path);
    const { title } = body;
    const { filename } = file;
    return await this.imageService.createImage({
      key: filename,
      width,
      height,
      fileSize: file.size,
      title,
    });
  }
}
