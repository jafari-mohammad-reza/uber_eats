import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { CloudinaryContent } from '../../cloudinary/models';

@InputType()
export class UpdateCategoryInputType {
  @Field((type) => Int, { name: 'id', nullable: false })
  @IsNumber()
  id: number;
  @Field((type) => String, { name: 'title', nullable: true })
  @IsString()
  @IsOptional()
  title?: string;
  @Field((type) => CloudinaryContent, { nullable: true })
  @IsObject()
  @IsOptional()
  image?: CloudinaryContent;
}
