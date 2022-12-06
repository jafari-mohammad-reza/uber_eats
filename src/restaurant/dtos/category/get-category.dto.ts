import {
  CommonInputDto,
  CommonOutputDto,
} from '../../common/dtos/commonOutputDto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CategoryEntity } from '../category.entity';
import { RestaurantEntity } from '../../restaurant/restaurant.entity';
import { IsNumber, IsString } from 'class-validator';

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
  @Field((type) => Int, { name: 'id', nullable: false })
  @IsNumber()
  id: number;
}

@InputType()
export class GetCategoryBySlugInput extends CommonInputDto {
  @Field((type) => String, { nullable: false, name: 'slug' })
  @IsString()
  slug: string;
}
