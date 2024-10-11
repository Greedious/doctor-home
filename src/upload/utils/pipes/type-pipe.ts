import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  private allowedExtensions = ['jpg', 'jpeg', 'png'];
  transform(value: any): any {
    const fileExtension = value.originalname.split('.').pop().toLowerCase();
    if (!this.allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException(
        'File type not allowed. Allowed file types are: jpg, jpeg, png',
      );
    }
    return value;
  }
}
