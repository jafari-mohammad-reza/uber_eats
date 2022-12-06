import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { RestaurantEntity } from '../restaurant.entity';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { CloudinaryContent } from '../../cloudinary/models';
import { GeoLocation } from '../../common/entities/core.entity';

@InputType()
export class CreateRestaurantInputType extends PickType(RestaurantEntity, [
  'title',
  'geoLocation',
  'coverImage',
  'teaserVideo',
  'address',
  'description',
]) {
  @Field((type) => String, { nullable: false })
  @IsString()
  category: string;
}
@InputType()
export class UpdateRestaurantInputType {
  @Field((type) => Int, {
    nullable: false,
    name: 'id',
  })
  @IsNumber()
  id: number;
  @Field((type) => String, {
    nullable: true,
    name: 'description',
  })
  @IsString()
  @IsOptional()
  description?: string;
  @Field((type) => CloudinaryContent, {
    nullable: true,
    name: 'coverImage',
  })
  @IsObject()
  @IsOptional()
  coverImage?: CloudinaryContent;
  @Field((type) => CloudinaryContent, {
    nullable: true,
    name: 'teaserVideo',
  })
  @IsObject()
  @IsOptional()
  teaserVideo?: CloudinaryContent;
  @Field((type) => String, {
    nullable: true,
    name: 'address',
  })
  @IsString()
  @IsOptional()
  address?: string;
  @Field((type) => GeoLocation, { nullable: true })
  @IsOptional()
  @IsObject()
  geoLocation?: GeoLocation;

  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  category?: string;
}
