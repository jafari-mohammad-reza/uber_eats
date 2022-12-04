import { InputType, PickType } from '@nestjs/graphql';
import { CategoryEntity } from '../../entities/category.entity';

@InputType()
export class CreateCategoryInputType extends PickType(CategoryEntity, [
  'title',
  'image',
]) {}
