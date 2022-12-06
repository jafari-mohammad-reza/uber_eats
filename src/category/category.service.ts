import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { Repository } from 'typeorm';
import { RestaurantService } from '../restaurant/restaurant.service';
import {
  CommonInputDto,
  CommonOutputDto,
} from '../common/dtos/commonOutputDto';
import { UpdateCategoryInputType } from './dtos/update-category.dto';
import { CreateCategoryInputType } from './dtos/create-category.dto';
import {
  GetCategoryByIdInput,
  GetCategoryBySlugInput,
  GetCategoryOutputType,
} from './dtos/get-category.dto';
import { CloudinaryService } from '../cloudinary/clodinary.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly restaurantService: RestaurantService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async getAll({ take, page }: CommonInputDto): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({
      take: take,
      skip: (page - 1) * take,
    });
  }

  async getOrCreate(category: string | number): Promise<CategoryEntity> {
    const existCategory = await this.categoryRepository.findOne({
      where: [{ id: Number(category) }, { title: category.toString() }],
    });
    if (!existCategory) {
      if (typeof category == 'number') {
        throw Error('There is no category with this id');
      } else {
        return await this.categoryRepository.save({
          title: category.toString(),
        });
      }
    }
    return existCategory;
  }

  async getById({
    take,
    page,
    id,
  }: GetCategoryByIdInput): Promise<GetCategoryOutputType> {
    try {
      const category = await this.categoryRepository.findOneBy({ id });
      return await this.returnRestaurantByCategory(category, take, page);
    } catch (err) {
      return {
        ok: false,
        error: err.message,
      };
    }
  }

  async getBySlug({
    take,
    page,
    slug,
  }: GetCategoryBySlugInput): Promise<GetCategoryOutputType> {
    try {
      const category = await this.categoryRepository.findOneBy({
        title: slug.replace('-', ' '),
      });
      return await this.returnRestaurantByCategory(category, take, page);
    } catch (err) {
      return {
        ok: false,
        error: err.message,
      };
    }
  }

  async returnRestaurantByCategory(
    category: CategoryEntity,
    take: number,
    page: number,
  ): Promise<GetCategoryOutputType> {
    try {
      if (!category)
        return { ok: false, error: 'There is no category with this title' };
      const restaurants = await this.restaurantService.getByCategoryId({
        id: category.id,
        take,
        page,
      });
      return {
        ok: true,
        error: null,
        category,
        restaurants,
        totalRestaurants: await this.restaurantService.countRestaurant(
          category,
        ),
      };
    } catch (err) {
      return {
        ok: false,
        error: err.message,
      };
    }
  }

  async createOne({
    title,
    image,
  }: CreateCategoryInputType): Promise<CommonOutputDto> {
    try {
      const existCategory = await this.categoryRepository.findOneBy({ title });
      if (existCategory) {
        return {
          ok: false,
          error: 'There is already one category with this title',
        };
      } else {
        const stringifyImage = JSON.stringify(image);
        await this.categoryRepository.save({ title, image });
        return {
          ok: true,
          error: null,
        };
      }
    } catch (err) {
      return {
        ok: false,
        error: err.message,
      };
    }
  }

  async updateOne({
    title,
    id,
    image,
  }: UpdateCategoryInputType): Promise<CommonOutputDto> {
    try {
      const existIdCategory = await this.categoryRepository.findOneBy({ id });
      if (!existIdCategory) {
        return {
          ok: false,
          error: 'There no category with this id',
        };
      } else {
        const existTitleCategory = await this.categoryRepository.findOneBy({
          title,
        });
        if (existTitleCategory) {
          return {
            ok: false,
            error: 'There is already one category with this title',
          };
        } else {
          if (image) {
            this.cloudinaryService
              .removeContent(existIdCategory.image.publicId)
              .catch((err) => {
                console.log(err);
              });
          }
          await this.categoryRepository.update(id, { title, image });
          return {
            ok: true,
            error: null,
          };
        }
      }
    } catch (err) {
      return {
        ok: false,
        error: err.message,
      };
    }
  }

  async deleteOne(id: number): Promise<CommonOutputDto> {
    try {
      const existCategory = await this.categoryRepository.findOneBy({ id });
      if (!existCategory) {
        return {
          ok: false,
          error: 'There is no category with this id',
        };
      }
      this.cloudinaryService
        .removeContent(existCategory.image.publicId)
        .catch((err) => {
          console.log(err);
        });
      await this.categoryRepository.delete({ id });
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
