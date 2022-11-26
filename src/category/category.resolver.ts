import { Args, Query, Resolver } from '@nestjs/graphql';
import { CategoryEntity } from './category.entity';
import { CategoryService } from './category.service';
import {
  CategoryPaginationInput,
  CategoryPaginationOutPut,
} from './dtos/category-pagination.dto';

@Resolver((type) => CategoryEntity)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}
  @Query((returns) => [CategoryEntity])
  async getAllCategories() {
    return await this.categoryService.findAllCategories();
  }
  @Query((returns) => CategoryPaginationOutPut)
  async getCategoryBYSlug(
    @Args('input') { name, page }: CategoryPaginationInput,
  ) {
    return await this.categoryService.findCategoryByName(name, page);
  }
}
