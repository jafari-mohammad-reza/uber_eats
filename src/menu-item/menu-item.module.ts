import { Module } from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { MenuItemResolver } from './menu-item.resolver';
import { CloudinaryService } from '../cloudinary/clodinary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemEntity } from './menu-item.entity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { CategoryService } from '../category/category.service';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { CategoryEntity } from '../category/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MenuItemEntity,
      RestaurantEntity,
      CategoryEntity,
    ]),
  ],
  providers: [
    MenuItemService,
    MenuItemResolver,
    CloudinaryService,
    RestaurantService,
    CategoryService,
  ],
})
export class MenuItemModule {}
