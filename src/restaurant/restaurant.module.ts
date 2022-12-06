import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from './restaurant.entity';
import { RestaurantService } from './services/restaurant/restaurant.service';
import { CategoryService } from './services/category/category.service';
import { RestaurantResolver } from './restaurant.resolver';
import { CategoryEntity } from '../category/category.entity';
import { CategoryResolver } from './resolvers/category.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity, CategoryEntity])],
  providers: [
    RestaurantResolver,
    RestaurantService,
    CategoryService,
    CategoryResolver,
  ],
})
export class RestaurantModule {}
