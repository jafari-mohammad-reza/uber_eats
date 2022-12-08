import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantEntity } from './restaurant.entity';
import { Raw, Repository } from 'typeorm';

import {
  CommonInputDto,
  CommonOutputDto,
} from '../common/dtos/commonOutputDto';
import {
  CreateRestaurantInputType,
  UpdateRestaurantInputType,
} from './dtos/modify-restaurant.dto';
import {
  GetRestaurantOutput,
  GetRestaurantsInput,
  GetRestaurantsOutput,
} from './dtos/get-restaurant.dto';
import { GetCategoryByIdInput } from '../category/dtos/get-category.dto';
import { CategoryEntity } from '../category/category.entity';
import { CloudinaryService } from '../cloudinary/clodinary.service';
import { UserEntity } from '../users/user.entity';
import { RateInputType } from '../common/dtos/rate.dto';
import { DefaultImage } from '../common/constants';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly cloudinaryService: CloudinaryService,
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
      const restaurant = await this.restaurantRepository.findOne({
        where: { id },
        relations: ['menu', 'owner'],
        loadEagerRelations: true,
      });
      if (!restaurant) {
        return {
          ok: false,
          error: 'There is no restaurant with this id',
        };
      }

      restaurant.getAverageRatings && restaurant.getAverageRatings();
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
          relations: ['menu', 'owner'],
          loadEagerRelations: true,
        },
      );
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

  async createRestaurant(
    input: CreateRestaurantInputType,
    owner: UserEntity,
  ): Promise<CommonOutputDto> {
    try {
      if (await this.restaurantRepository.findOneBy({ title: input.title }))
        return {
          ok: false,
          error: 'There already one restaurant with this title',
        };
      const existCategory = await this.getOrCreateCategory(input.category);
      await this.restaurantRepository.save([
        {
          ...input,
          category: existCategory,
          owner,
        },
      ]);
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

  async updateRestaurant(
    input: UpdateRestaurantInputType,
    user: UserEntity,
  ): Promise<CommonOutputDto> {
    try {
      const { restaurant } = await this.getRestaurantById(input.id);
      if (!restaurant) {
        return {
          ok: false,
          error: 'There is no restaurant with this id',
        };
      }
      if (user.id !== restaurant.owner.id) {
        return {
          ok: false,
          error: 'You are not this restaurant owner',
        };
      }
      let category: CategoryEntity = null;
      if (input.category) {
        category = await this.getOrCreateCategory(input.category);
      } else {
        category = restaurant.category;
      }
      if (input.coverImage) {
        this.cloudinaryService
          .removeContent(restaurant.coverImage.publicId)
          .catch((err) => {
            console.log(err);
          });
      }
      if (restaurant.teaserVideo && input.teaserVideo) {
        this.cloudinaryService
          .removeContent(restaurant.teaserVideo.publicId)
          .catch((err) => {
            console.log(err);
          });
      }
      await this.restaurantRepository.save([
        {
          id: input.id,
          ...input,
          ...(category && { category }),
        },
      ]);
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
  async deleteRestaurant(
    id: number,
    user: UserEntity,
  ): Promise<CommonOutputDto> {
    try {
      const { restaurant } = await this.getRestaurantById(id);
      if (!restaurant) {
        return {
          ok: false,
          error: 'There is no restaurant with this id',
        };
      }
      if (user.id !== restaurant.owner.id) {
        return {
          ok: false,
          error: 'You are not this restaurant owner',
        };
      }
      restaurant.coverImage &&
        this.cloudinaryService
          .removeContent(restaurant.coverImage.publicId)
          .catch((err) => {
            console.log(err);
          });

      restaurant.teaserVideo &&
        this.cloudinaryService
          .removeContent(restaurant.teaserVideo.publicId)
          .catch((err) => {
            console.log(err);
          });

      await this.restaurantRepository.delete(restaurant.id);
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

  async rateRestaurant(
    user: UserEntity,
    { targetId, stars }: RateInputType,
  ): Promise<CommonOutputDto> {
    try {
      const restaurant = await this.restaurantRepository.findOneBy({
        id: targetId,
      });
      if (!restaurant)
        return { ok: false, error: 'There is no restaurant with this id' };
      const existRate = restaurant.ratings.find(
        (ratings) => ratings.userId === user.id,
      );
      if (!existRate) {
        await this.restaurantRepository.update(restaurant.id, {
          ratings: [...restaurant.ratings, { userId: user.id, stars }],
        });
      } else {
        existRate.stars = stars;
        await restaurant.save();
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

  async getOrCreateCategory(category: string): Promise<CategoryEntity> {
    const existCategory = await this.categoryRepository.findOneBy({
      title: category,
    });
    if (!existCategory) {
      return await this.categoryRepository.save({
        title: category,
        image: DefaultImage,
      });
    }
    return existCategory;
  }
}
