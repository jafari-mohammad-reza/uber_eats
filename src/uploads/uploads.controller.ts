import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/clodinary.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    try {
      return await this.cloudinaryService.uploadContent(file);
    } catch (e) {
      return null;
    }
  }
}
