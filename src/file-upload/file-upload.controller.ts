import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { basename, extname } from 'path';
import { sanitizeFileName } from './file-utils';

@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('server-upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, callback) => {
          const fileExtension = extname(file.originalname).toLowerCase();
          const originalName = basename(file.originalname, fileExtension);
          const sanitizedName = sanitizeFileName(originalName);
          const newFileName = `${sanitizedName}-${Date.now()}${fileExtension}`;
          callback(null, newFileName);
        },
      }),
      limits: {
        fileSize: 3 * 1024 * 1024,
      },
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              'Invalid file type, only image files allowed',
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return {
      message: 'File uploaded successullyy',
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
