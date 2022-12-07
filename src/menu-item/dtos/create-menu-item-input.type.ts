import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { MenuItemEntity } from '../menu-item.entity';
import { IsNumber } from 'class-validator';

@InputType()
export class CreateMenuItemInputType extends PickType(MenuItemEntity, [
  'name',
  'description',
  'coverImage',
  'options',
  'price',
]) {
  @Field((type) => Int, { nullable: false })
  @IsNumber()
  restaurantId: number;
}
