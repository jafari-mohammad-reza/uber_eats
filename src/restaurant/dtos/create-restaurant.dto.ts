import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { RestaurantEntity } from '../restaurant.entity';
import { CoreOutputDto } from '../../common/dtos/common-output.dto';

@InputType()
export class CreateRestaurantInputType extends PickType(RestaurantEntity, [
  'name',
  'coverImage',
  'teaserVideo',
  'address',
  'description',
  'geoLocation',
]) {}

@ObjectType()
export class CreateRestaurantOutPutType extends CoreOutputDto {}
