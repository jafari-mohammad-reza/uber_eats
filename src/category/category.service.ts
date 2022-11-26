import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryPaginationOutPut } from './dtos/category-pagination.dto';
import { RestaurantService } from '../restaurant/restaurant.service';
import { CreateCategoryInput } from './dtos/create-category.dto';
import { CoreOutputDto } from '../common/dtos/common-output.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly restaurantService: RestaurantService,
  ) {}
  async findAllCategories(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find();
  }
  async findCategoryByName(
    name: string,
    page: number,
  ): Promise<CategoryPaginationOutPut> {
    try {
      const category = await this.categoryRepository.findOneBy({
        name: name.replace(' ', '-'),
      });
      if (!category)
        return { ok: false, error: 'There is no category with this name' };
      const restaurants = await this.restaurantService.findRestaurantByCategory(
        category.id,
      );
      return {
        ok: true,
        error: null,
        category,
        restaurants,
        totalResult: Math.ceil(restaurants.length / 25),
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }
  async createCategory({
    name,
    coverImage,
  }: CreateCategoryInput): Promise<CoreOutputDto> {
    try {
      if (await this.categoryRepository.findOneBy({ name })) {
        return {
          ok: false,
          error: 'There is already a category with this name',
        };
      }
      await this.categoryRepository.save({
        name: name.replace(' ', '-'),
        coverImage,
      });
      return {
        ok: true,
        error: null,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }
}
