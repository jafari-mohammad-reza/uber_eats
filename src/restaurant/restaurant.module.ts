import { Module, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth/auth.guard';
import { RestaurantResolver } from './restaurant.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantService } from './restaurant.service';
import { RestaurantEntity } from './restaurant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity])],
  providers: [RestaurantResolver, RestaurantService],
})
@UseGuards(AuthGuard)
export class RestaurantModule {}
