import { Module } from '@nestjs/common';
import { UploadController } from './api/controller/upload.controller';
import { UploadService } from './service/upload.service';
import { MulterModule } from '@nestjs/platform-express';
import { storage } from './utils/multer.storing';
import { ImageModule } from 'src/image/image.module';
import { UploadValidation } from './api/validation';
@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        storage,
      }),
    }),
    ImageModule,
  ],
  controllers: [UploadController],
  providers: [UploadService, UploadValidation],
})
export class UploadModule {}
