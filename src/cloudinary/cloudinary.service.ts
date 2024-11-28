import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, ResourceApiResponse } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import { UPLOADS_CLOUDINARY_FOLDER } from '../file-upload/constants';

@Injectable()
export class CloudinaryService {
  uploadImage(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      cloudinary.uploader.upload(file.path, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  async uploadImageStream(
    file: Express.Multer.File,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: UPLOADS_CLOUDINARY_FOLDER,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async getImagesByAssetFolder(
    assetFolder: string,
  ): Promise<ResourceApiResponse> {
    return new Promise<ResourceApiResponse>((resolve, reject) => {
      cloudinary.api.resources_by_asset_folder(
        assetFolder,
        { metadata: true },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        },
      );
    });
  }

  async deleteFile(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });
    });
  }
}
