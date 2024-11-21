import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';

@Module({
  imports: [],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
