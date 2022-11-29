import { Field, InputType, PickType } from '@nestjs/graphql';
import { CategoryEntity } from '../category.entity';

@InputType()
export class UpdateCategoryInputType extends PickType(CategoryEntity, [
  'title',
  'image',
]) {
  @Field((type) => Number)
  id: number;
}
