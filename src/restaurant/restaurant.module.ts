import { Module } from '@nestjs/common';

import { RestaurantResolver } from './restaurant.resolver';
import { RestaurantService } from './restaurant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../category/category.entity';
import { RestaurantEntity } from './restaurant.entity';
import { CategoryService } from '../category/category.service';
import { CloudinaryService } from '../cloudinary/clodinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, RestaurantEntity])],
  providers: [
    RestaurantResolver,
    RestaurantService,
    CategoryService,
    CloudinaryService,
  ],
  exports: [RestaurantService],
})
export class RestaurantModule {}
