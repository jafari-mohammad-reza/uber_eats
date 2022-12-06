import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from './restaurant.entity';

import { RestaurantResolver } from './restaurant.resolver';
import { CategoryEntity } from '../category/category.entity';
import { RestaurantService } from './restaurant.service';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity, CategoryEntity])],
  providers: [RestaurantResolver, RestaurantService],
})
export class RestaurantModule {}
