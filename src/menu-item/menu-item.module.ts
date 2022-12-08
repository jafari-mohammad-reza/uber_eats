import { Module } from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { MenuItemResolver } from './menu-item.resolver';
import { CloudinaryService } from '../cloudinary/clodinary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemEntity } from './menu-item.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItemEntity, RestaurantEntity])],
  providers: [MenuItemService, MenuItemResolver, CloudinaryService],
})
export class MenuItemModule {}
