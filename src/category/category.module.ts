import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { CategoryResolver } from './category.resolver';
import { CloudinaryService } from '../cloudinary/clodinary.service';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, RestaurantEntity]),
    UsersModule,
  ],
  providers: [
    CategoryService,
    RestaurantService,
    CategoryResolver,
    CloudinaryService,
  ],
})
export class CategoryModule {}
