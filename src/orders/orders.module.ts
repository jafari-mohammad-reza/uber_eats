import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { MenuItemEntity } from '../menu-item/menu-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      RestaurantEntity,
      OrderItemEntity,
      MenuItemEntity,
    ]),
  ],
  providers: [OrdersService],
})
export class OrdersModule {}
