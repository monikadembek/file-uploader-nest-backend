import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { basename, extname } from 'path';
import { sanitizeFileName } from './file-utils';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_FILE_SIZE,
  UPLOADS_LOCAL_FOLDER,
} from './constants';

@Controller('files')
export class FileUploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('server-image-upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOADS_LOCAL_FOLDER,
        filename: (req, file, callback) => {
          const fileExtension = extname(file.originalname).toLowerCase();
          const originalName = basename(file.originalname, fileExtension);
          const sanitizedName = sanitizeFileName(originalName);
          const newFileName = `${sanitizedName}-${Date.now()}${fileExtension}`;
          callback(null, newFileName);
        },
      }),
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ALLOWED_IMAGE_MIME_TYPES;
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

  @Post('cloudinary-image-upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ALLOWED_IMAGE_MIME_TYPES;
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
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    console.log('file extracted from request: ', file);

    const result = await this.cloudinaryService.uploadImageStream(file);
    console.log('result', result);

    return {
      message: 'File uploaded successfully',
      imagePublicId: result.public_id,
      url: result.secure_url,
    };
  }
}
