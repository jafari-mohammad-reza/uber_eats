import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CategoryEntity } from '../category.entity';
import { RestaurantEntity } from '../../restaurant/restaurant.entity';
import { GraphQLFloat } from 'graphql/type';
import { CoreOutputDto } from '../../common/dtos/common-output.dto';

@ObjectType()
export class CategoryPaginationOutPut extends CoreOutputDto {
  @Field((type) => CategoryEntity, { nullable: true })
  category?: CategoryEntity;
  @Field((type) => [RestaurantEntity], { nullable: true })
  restaurants?: RestaurantEntity[];
  @Field((type) => Number, { nullable: true })
  totalResult?: number;
}

@InputType()
export class CategoryPaginationInput {
  @Field((type) => String, { nullable: false })
  name: string;
  @Field((type) => Number, { nullable: true })
  page?: number;
}
