import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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
import { CategoryEntity } from './category.entity';
import { CategoryService } from './category.service';
import { Role } from '../decorators/role/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RightRoleGuard } from '../guards/right-role/right-role.guard';

@Resolver((returns) => CategoryEntity)
@UseGuards(RightRoleGuard)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query((returns) => [CategoryEntity])
  async getAllCategories(
    @Args('input') { take = 10, page = 1 }: CommonInputDto,
  ): Promise<CategoryEntity[]> {
    return await this.categoryService.getAll({ take, page });
  }

  @Query((returns) => GetCategoryOutputType)
  async getCategoryById(
    @Args('input') { id, take = 10, page = 1 }: GetCategoryByIdInput,
  ): Promise<GetCategoryOutputType> {
    console.log(id);
    return await this.categoryService.getById({ id, take, page });
  }

  @Query((returns) => GetCategoryOutputType)
  async getCategoryBySlug(
    @Args('input') { slug, take = 10, page = 1 }: GetCategoryBySlugInput,
  ): Promise<GetCategoryOutputType> {
    return await this.categoryService.getBySlug({ slug, take, page });
  }

  @Mutation((returns) => CommonOutputDto)
  @Role(['Admin', 'Owner'])
  async createCategory(
    @Args('input') inputDto: CreateCategoryInputType,
  ): Promise<CommonOutputDto> {
    return await this.categoryService.createOne(inputDto);
  }

  @Mutation((returns) => CommonOutputDto)
  @Role(['Admin'])
  async updateCategory(
    @Args('input') inputDto: UpdateCategoryInputType,
  ): Promise<CommonOutputDto> {
    return await this.categoryService.updateOne(inputDto);
  }

  @Mutation((returns) => CommonOutputDto)
  @Role(['Admin'])
  async deleteCategory(@Args('id') id: number): Promise<CommonOutputDto> {
    return await this.categoryService.deleteOne(id);
  }
}
