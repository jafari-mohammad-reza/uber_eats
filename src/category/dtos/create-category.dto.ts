import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CategoryEntity } from '../category.entity';

@InputType()
export class CreateCategoryInput extends PickType(CategoryEntity, [
  'name',
  'coverImage',
]) {}
