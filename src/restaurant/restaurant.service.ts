import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantEntity } from './restaurant.entity';
import { Raw, Repository } from 'typeorm';

import {
  CommonInputDto,
  CommonOutputDto,
} from '../common/dtos/commonOutputDto';
import { ModifyRestaurantInputType } from './dtos/modify-restaurant.dto';
import {
  GetRestaurantOutput,
  GetRestaurantsInput,
  GetRestaurantsOutput,
} from './dtos/get-restaurant.dto';
import { GetCategoryByIdInput } from '../category/dtos/get-category.dto';
import { CategoryEntity } from '../category/category.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
  ) {}
  async getAllRestaurants({
    take,
    page,
  }: CommonInputDto): Promise<RestaurantEntity[]> {
    return await this.restaurantRepository.find({
      take: take,
      skip: (page - 1) * take,
    });
  }

  async getRestaurantById(id: number): Promise<GetRestaurantOutput> {
    try {
      const restaurant = await this.restaurantRepository.findOneBy({ id });
      // TODO : return dished as well
      return {
        ok: true,
        restaurant,
        error: null,
      };
    } catch (err) {
      return {
        ok: false,
        error: err.message,
      };
    }
  }
  async getRestaurantsByTitle({
    inputTitle,
    page,
    take,
  }: GetRestaurantsInput): Promise<GetRestaurantsOutput> {
    try {
      const [restaurants, count] = await this.restaurantRepository.findAndCount(
        {
          where: { title: Raw((title) => `${title} ILIKE '%${inputTitle}%'`) },
          skip: (page - 1) * take,
          take: take,
        },
      );
      // TODO : return dished as well
      return {
        ok: true,
        restaurants,
        count,
        error: null,
      };
    } catch (err) {
      return {
        ok: false,
        error: err.message,
      };
    }
  }

  // async createRestaurant(
  //   {
  //     title,
  //     coverImage,
  //     category,
  //     description,
  //     address,
  //     geoLocation,
  //     teaserVideo,
  //   }: ModifyRestaurantInputType,
  //   ownerId: number,
  // ): Promise<CommonOutputDto> {
  //   try {
  //     const existCategory = await this.categoryService.getOrCreate(category);
  //     if (await this.restaurantRepository.findOneBy({ title }))
  //       return {
  //         ok: false,
  //         error: 'There already one restaurant with this title',
  //       };
  //     await this.restaurantRepository.save({
  //       teaserVideo,
  //       ownerId,
  //       title,
  //       description,
  //       address,
  //       geoLocation,
  //       coverImage,
  //       category: existCategory,
  //     });
  //     return {
  //       ok: true,
  //       error: null,
  //     };
  //   } catch (err) {
  //     return {
  //       ok: false,
  //       error: err.message,
  //     };
  //   }
  // }

  async updateRestaurant(
    id: number,
    input: ModifyRestaurantInputType,
  ): Promise<CommonOutputDto> {
    try {
      const { restaurant } = await this.getRestaurantById(id);
      if (input.coverImage) {
        // remove image
      }
      if (restaurant.teaserVideo && input.teaserVideo) {
        // remove teaser video
      }
      const newRestaurantData = Object.assign(restaurant, input);
      await this.restaurantRepository.update(id, newRestaurantData);
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
  async deleteRestaurant(id: number): Promise<CommonOutputDto> {
    try {
      await this.restaurantRepository.delete({ id }).catch((err) => {
        return {
          ok: false,
          error: err.message,
        };
      });
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
  async countRestaurant(category: CategoryEntity): Promise<number> {
    return await this.restaurantRepository.count({
      where: { category: { id: category.id } },
    });
  }
  async getByCategoryId({
    take,
    page,
    id,
  }: GetCategoryByIdInput): Promise<RestaurantEntity[]> {
    return await this.restaurantRepository.find({
      where: { category: { id: id } },
      take: take,
      skip: (page - 1) * take,
    });
  }
}
