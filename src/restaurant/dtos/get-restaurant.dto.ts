import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { RestaurantEntity } from '../entities/restaurant.entity';
import {
  CommonInputDto,
  CommonOutputDto,
} from '../../common/dtos/commonOutputDto';

@ObjectType()
export class GetRestaurantOutput extends CommonOutputDto {
  @Field((type) => RestaurantEntity, { nullable: true })
  restaurant?: RestaurantEntity;
  // dished down here
}
@ObjectType()
export class GetRestaurantsOutput extends CommonOutputDto {
  @Field((type) => [RestaurantEntity], { nullable: true })
  restaurants?: RestaurantEntity[];
  @Field((type) => Number, { nullable: true })
  count?: number;
  // dished down here
}

@InputType()
export class GetRestaurantsInput extends CommonInputDto {
  @Field((type) => String, { nullable: false })
  inputTitle: string;
}
