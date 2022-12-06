import { Field, InputType, PickType } from '@nestjs/graphql';
import { RestaurantEntity } from '../restaurant.entity';

@InputType()
export class ModifyRestaurantInputType extends PickType(RestaurantEntity, [
  'title',
  'geoLocation',
  'coverImage',
  'teaserVideo',
  'address',
  'description',
]) {
  @Field((type) => String || Number, { nullable: false })
  category: string | number;
}
