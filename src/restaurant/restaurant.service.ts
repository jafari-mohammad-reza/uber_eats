import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantEntity } from './restaurant.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import {
  CreateRestaurantInputType,
  CreateRestaurantOutPutType,
} from './dtos/create-restaurant.dto';
import { CategoryEntity } from '../category/category.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
  ) {}

  async createRestaurant(
    owner: UserEntity,
    createRestaurantInputType: CreateRestaurantInputType,
  ): Promise<CreateRestaurantOutPutType> {
    try {
      return {
        ok: true,
        error: null,
      };
    } catch (e) {
      return {
        ok: false,
        error: e.message,
      };
    }
  }
  async findRestaurantByCategory(categoryId: number, page?: number) {
    return await this.restaurantRepository.find({
      where: { categoryId },
      skip: (page - 1) * 25,
      take: 25,
    });
  }
}
