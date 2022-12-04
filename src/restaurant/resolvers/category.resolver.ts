import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryService } from '../services/category/category.service';
import {
  CommonInputDto,
  CommonOutputDto,
} from '../../common/dtos/commonOutputDto';
import { CreateCategoryInputType } from '../dtos/category/create-category.dto';
import { UpdateCategoryInputType } from '../dtos/category/update-category.dto';
import {
  GetCategoryByIdInput,
  GetCategoryBySlugInput,
  GetCategoryOutputType,
} from '../dtos/category/get-category.dto';

@Resolver((returns) => CategoryEntity)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query((returns) => [CategoryEntity])
  async getAllCategories(
    @Args('input') inputDto: CommonInputDto,
  ): Promise<CategoryEntity[]> {
    return await this.categoryService.getAll(inputDto);
  }

  @Query((returns) => GetCategoryOutputType)
  async getCategoryById(
    @Args('input') inputDto: GetCategoryByIdInput,
  ): Promise<GetCategoryOutputType> {
    return await this.categoryService.getById(inputDto);
  }

  @Query((returns) => GetCategoryOutputType)
  async getCategoryBySlug(
    @Args('input') inputDto: GetCategoryBySlugInput,
  ): Promise<GetCategoryOutputType> {
    return await this.categoryService.getBySlug(inputDto);
  }

  @Mutation((returns) => CommonOutputDto)
  async createCategory(
    @Args('input') inputDto: CreateCategoryInputType,
  ): Promise<CommonOutputDto> {
    return await this.categoryService.createOne(inputDto);
  }

  @Mutation((returns) => CommonOutputDto)
  async updateCategory(
    @Args('input') inputDto: UpdateCategoryInputType,
  ): Promise<CommonOutputDto> {
    return await this.categoryService.updateOne(inputDto);
  }

  @Mutation((returns) => CommonOutputDto)
  async deleteCategory(@Args('id') id: number): Promise<CommonOutputDto> {
    return await this.categoryService.deleteOne(id);
  }
}
