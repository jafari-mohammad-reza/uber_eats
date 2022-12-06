import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadContent(
    file: Express.Multer.File,
  ): Promise<{ url: string; publicId: string } | string> {
    return new Promise((resolve, reject) => {
      let upload;
      if (
        file.originalname.endsWith('.png') ||
        file.originalname.endsWith('.jpeg')
      ) {
        if (file.size > 200000) resolve('File must be less thant 2mb');
        upload = v2.uploader.upload_stream((error, result) => {
          if (error) return reject(error);
          resolve({ url: result.url, publicId: result.public_id });
        });
        toStream(file.buffer).pipe(upload);
      } else if (
        file.originalname.endsWith('.mp4') ||
        file.originalname.endsWith('.gif')
      ) {
        if (file.size > 1000000) resolve('File must be less thant 10mb');
        upload = v2.uploader.upload_large(file.path, (error, result) => {
          if (error) return reject(error);
          resolve({ url: result.url, publicId: result.public_id });
        });
        toStream(file.buffer).pipe(upload);
      } else {
        resolve('Not a valid file');
      }
    });
  }
  async removeContent(publicId: string) {
    return await v2.uploader.destroy(publicId);
  }
}
