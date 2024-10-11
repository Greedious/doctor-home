import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  private maxFileSize = 3 * 1024 * 1024; // 3 MB in bytes

  transform(value: any): any {
    if (value.size > this.maxFileSize) {
      throw new BadRequestException('File size exceeds the limit of 3 MB');
    }
    return value;
  }
}
