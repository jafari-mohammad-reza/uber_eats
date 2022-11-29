import { InputType, PickType } from '@nestjs/graphql';
import { RestaurantEntity } from '../entities/restaurant.entity';

@InputType()
export class CreateRestaurantInputType extends PickType(RestaurantEntity, [
  'title',
  'category',
  'geoLocation',
  'image',
  'teaser_video',
  'address',
  'description',
]) {}
