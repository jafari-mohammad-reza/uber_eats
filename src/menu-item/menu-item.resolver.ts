import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MenuItemEntity } from './menu-item.entity';
import { MenuItemService } from './menu-item.service';
import { GetMenuItemOutPut } from './dtos/get-menuItem.dto';
import { CommonOutputDto } from '../common/dtos/commonOutputDto';
import { CreateMenuItemInputType } from './dtos/create-menu-item-input.type';
import { CurrentUser } from '../decorators/current-user/current-user.decorator';
import { UserEntity } from '../users/user.entity';
import { UpdateMenuItemInput } from './dtos/update-menuItem.dto';
import { Role } from '../decorators/role/roles.decorator';
import { RateInputType } from '../common/dtos/rate.dto';
import { UseGuards } from '@nestjs/common';
import { RightRoleGuard } from '../guards/right-role/right-role.guard';

@Resolver((of) => MenuItemEntity)
@UseGuards(RightRoleGuard)
export class MenuItemResolver {
  constructor(private readonly menuItemService: MenuItemService) {}
  @Query((returns) => GetMenuItemOutPut)
  async getMenuItemById(@Args('id') id: number): Promise<GetMenuItemOutPut> {
    return await this.menuItemService.getById(id);
  }
  @Mutation((returns) => CommonOutputDto)
  @Role(['Owner'])
  async createMenuItem(
    @CurrentUser() user: UserEntity,
    @Args('input') input: CreateMenuItemInputType,
  ): Promise<CommonOutputDto> {
    return await this.menuItemService.createMenuItem(user, input);
  }
  @Mutation((returns) => CommonOutputDto)
  @Role(['Owner'])
  async updateMenuItem(
    @CurrentUser() user: UserEntity,
    @Args('input') input: UpdateMenuItemInput,
  ): Promise<CommonOutputDto> {
    return await this.menuItemService.updateMenuItem(user, input);
  }
  @Mutation((returns) => CommonOutputDto)
  @Role(['Owner'])
  async deleteMenuItem(
    @CurrentUser() user: UserEntity,
    @Args('id') id: number,
  ): Promise<CommonOutputDto> {
    return await this.menuItemService.deleteMenuItem(user, id);
  }
  @Mutation((returns) => CommonOutputDto)
  @Role(['Client'])
  async rateMenuItem(
    @CurrentUser() user: UserEntity,
    @Args('input') input: RateInputType,
  ): Promise<CommonOutputDto> {
    return await this.menuItemService.rateMenuItem(user, input);
  }
}
