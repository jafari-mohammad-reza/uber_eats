import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  CommonInputDto,
  CommonOutputDto,
} from '../../../common/dtos/commonOutputDto';
import { CategoryEntity } from '../../entities/category.entity';
import { RestaurantEntity } from '../../entities/restaurant.entity';

@ObjectType()
export class GetCategoryOutputType extends CommonOutputDto {
  @Field((type) => CategoryEntity, { nullable: true })
  category?: CategoryEntity;
  @Field((type) => [RestaurantEntity], { nullable: true })
  restaurants?: RestaurantEntity[];
  @Field((type) => Number, { nullable: true })
  totalRestaurants?: number;
}

@InputType()
export class GetCategoryByIdInput extends CommonInputDto {
  @Field((type) => Number)
  id: number;
}

@InputType()
export class GetCategoryBySlugInput extends CommonInputDto {
  @Field((type) => String)
  slug: string;
}
