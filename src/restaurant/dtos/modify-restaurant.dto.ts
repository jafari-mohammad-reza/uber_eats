import { Field, InputType, Int, PartialType, PickType } from '@nestjs/graphql';
import { RestaurantEntity } from '../restaurant.entity';
import { IsNumber, IsOptional, IsString } from 'class-validator';

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
export class UpdateRestaurantInputType extends PickType(
  PartialType(RestaurantEntity),
  [
    'description',
    'address',
    'coverImage',
    'teaserVideo',
    'geoLocation',
    'title',
  ],
) {
  @Field((type) => Int, {
    nullable: false,
    name: 'id',
  })
  @IsNumber()
  id: number;

  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  category?: string;
}
