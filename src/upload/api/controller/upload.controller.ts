import { Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/service/upload.service';
import { FileSizeValidationPipe } from 'src/upload/utils/pipes/size-pipe';
import { FileTypeValidationPipe } from 'src/upload/utils/pipes/type-pipe';
import { UploadValidation } from '../validation';
import { UploadImage } from '../dto';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';

@AuthenticatedController({ controller: 'upload' })
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly uploadValidation: UploadValidation,
  ) {}

  // files are on http://localhost:3000/public/uploads/filename
  @AuthorizedApi({
    api: Api.POST,
    url: '',
  })
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(
    @UploadedFile(new FileTypeValidationPipe(), new FileSizeValidationPipe())
    file: Express.Multer.File,
    @Body() body: UploadImage,
  ) {
    this.uploadValidation.uploadImage({ body });
    return await this.uploadService.uploadImage(file, body);
  }
}
