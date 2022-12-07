import { Field, ObjectType } from '@nestjs/graphql';
import { CommonOutputDto } from '../../common/dtos/commonOutputDto';
import { MenuItemEntity } from '../menu-item.entity';

@ObjectType()
export class GetMenuItemOutPut extends CommonOutputDto {
  @Field((type) => MenuItemEntity, { nullable: true })
  menuItem?: MenuItemEntity;
}
