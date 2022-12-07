import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuItemEntity } from './menu-item.entity';
import { Repository } from 'typeorm';
import { GetMenuItemOutPut } from './dtos/get-menuItem.dto';
import { RestaurantService } from '../restaurant/restaurant.service';
import { UserEntity } from '../users/user.entity';
import { CreateMenuItemInputType } from './dtos/create-menu-item-input.type';
import { CommonOutputDto } from '../common/dtos/commonOutputDto';
import { UpdateMenuItemInput } from './dtos/update-menuItem.dto';
import { RateInputType } from '../common/dtos/rate.dto';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItemEntity)
    private readonly menuItemRepository: Repository<MenuItemEntity>,
    @Inject(forwardRef(() => RestaurantService))
    private readonly restaurantService: RestaurantService,
  ) {}
  async getById(id: number): Promise<GetMenuItemOutPut> {
    try {
      const menuItem = await this.menuItemRepository.findOneBy({ id });
      menuItem.getAverageRatings();
      return {
        ok: true,
        menuItem,
      };
    } catch (err) {
      return {
        ok: false,
        error: err.message,
        menuItem: null,
      };
    }
  }
  async createMenuItem(
    user: UserEntity,
    {
      name,
      description,
      price,
      restaurantId,
      coverImage,
      options,
    }: CreateMenuItemInputType,
  ): Promise<CommonOutputDto> {
    try {
      const { restaurant } = await this.restaurantService.getRestaurantById(
        restaurantId,
      );

      if (!restaurant) {
        return { ok: false, error: 'There is no restaurant with this id' };
      }
      if (user.id !== restaurant.owner.id) {
        return { ok: false, error: 'You are not this restaurant owner' };
      }
      await this.menuItemRepository.save(
        this.menuItemRepository.create({
          name,
          description,
          price,
          coverImage,
          restaurant,
          options,
        }),
      );
      return {
        ok: true,
        error: null,
      };
    } catch (err) {
      return {
        ok: false,
        error: err.message,
      };
    }
  }
  async updateMenuItem(
    user: UserEntity,
    input: UpdateMenuItemInput,
  ): Promise<CommonOutputDto> {
    try {
      const menuItem = await this.menuItemRepository.findOne({
        where: { id: input.id },
        relations: ['restaurant'],
      });
      if (!menuItem) {
        return {
          ok: false,
          error: 'There is no menu item with this id',
        };
      }
      if (user.id !== menuItem.restaurant.ownerId['id']) {
        return {
          ok: false,
          error: 'You are not owner of this restaurant',
        };
      }
      await this.menuItemRepository.update(menuItem.id, { ...input });
      return {
        ok: true,
        error: null,
      };
    } catch (err) {
      return {
        ok: false,
        error: err.message,
      };
    }
  }

  async deleteMenuItem(user: UserEntity, id: number): Promise<CommonOutputDto> {
    try {
      const menuItem = await this.menuItemRepository.findOne({
        where: { id },
        relations: ['restaurant'],
      });
      if (!menuItem) {
        return {
          ok: false,
          error: 'There is no menu item with this id',
        };
      }
      if (user.id !== menuItem.restaurant.ownerId['id']) {
        return {
          ok: false,
          error: 'You are not owner of this restaurant',
        };
      }
      await this.menuItemRepository.delete(menuItem.id);
      return {
        ok: true,
        error: null,
      };
    } catch (err) {
      return {
        ok: false,
        error: err.message,
      };
    }
  }
  async rateMenuItem(
    user: UserEntity,
    { targetId, stars }: RateInputType,
  ): Promise<CommonOutputDto> {
    try {
      const menuItem = await this.menuItemRepository.findOneBy({
        id: targetId,
      });
      if (!menuItem)
        return { ok: false, error: 'There is no menuItem with this id' };
      const existRate = menuItem.ratings.find(
        (ratings) => ratings.userId === user.id,
      );
      if (!existRate) {
        await this.menuItemRepository.update(menuItem.id, {
          ratings: [...menuItem.ratings, { userId: user.id, stars }],
        });
      } else {
        existRate.stars = stars;
        await menuItem.save();
      }
      return {
        ok: true,
        error: null,
      };
    } catch (err) {
      return {
        ok: false,
        error: err.message,
      };
    }
  }
}
