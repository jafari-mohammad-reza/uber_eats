import { Module } from '@nestjs/common';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';
import { RestaurantService } from '../restaurant/restaurant.service';

@Module({
  providers: [CategoryResolver, CategoryService, RestaurantService],
})
export class CategoryModule {}
