import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RestaurantEntity } from './restaurant.entity';
import { RestaurantService } from './restaurant.service';
import {
  CreateRestaurantInputType,
  CreateRestaurantOutPutType,
} from './dtos/create-restaurant.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';

@Resolver((of) => RestaurantEntity)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation((returns) => CreateRestaurantOutPutType)
  async createRestaurant(
    @Args('input') createRestaurantInputType: CreateRestaurantInputType,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.restaurantService.createRestaurant(
      user,
      createRestaurantInputType,
    );
  }
}
