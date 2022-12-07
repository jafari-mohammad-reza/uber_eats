import { Field, InputType, Int, PartialType, PickType } from '@nestjs/graphql';
import { MenuItemEntity } from '../menu-item.entity';
import { IsNumber } from 'class-validator';

@InputType()
export class UpdateMenuItemInput extends PickType(PartialType(MenuItemEntity), [
  'name',
  'options',
  'price',
  'description',
]) {
  @Field((type) => Int, { nullable: false })
  @IsNumber()
  id: number;
}
