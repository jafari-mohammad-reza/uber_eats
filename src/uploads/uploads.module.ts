import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { CloudinaryService } from '../cloudinary/clodinary.service';

@Module({
  controllers: [UploadsController],
  providers: [CloudinaryService],
})
export class UploadsModule {}
