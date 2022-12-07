import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RestaurantService } from './restaurant.service';
import { RestaurantEntity } from './restaurant.entity';
import {
  CommonInputDto,
  CommonOutputDto,
} from '../common/dtos/commonOutputDto';
import {
  GetRestaurantOutput,
  GetRestaurantsInput,
  GetRestaurantsOutput,
} from './dtos/get-restaurant.dto';
import {
  CreateRestaurantInputType,
  UpdateRestaurantInputType,
} from './dtos/modify-restaurant.dto';
import { CurrentUser } from '../decorators/current-user/current-user.decorator';
import { UserEntity } from '../users/user.entity';
import { RightRoleGuard } from '../guards/right-role/right-role.guard';
import { UseGuards } from '@nestjs/common';
import { Role } from '../decorators/role/roles.decorator';
import { RateInputType } from '../common/dtos/rate.dto';

@Resolver((of) => RestaurantEntity)
@UseGuards(RightRoleGuard)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}
  @Query((returns) => [RestaurantEntity])
  async getAllRestaurants(
    @Args('input') { take = 10, page = 1 }: CommonInputDto,
  ): Promise<RestaurantEntity[]> {
    return await this.restaurantService.getAllRestaurants({ take, page });
  }
  @Query((returns) => GetRestaurantOutput)
  async getRestaurantById(
    @Args('id') id: number,
  ): Promise<GetRestaurantOutput> {
    return await this.restaurantService.getRestaurantById(id);
  }
  @Query((returns) => GetRestaurantsOutput)
  async getRestaurantsByTitle(
    @Args('input') { inputTitle, page = 1, take = 10 }: GetRestaurantsInput,
  ): Promise<GetRestaurantsOutput> {
    return await this.restaurantService.getRestaurantsByTitle({
      inputTitle,
      page,
      take,
    });
  }
  @Mutation((returns) => CommonOutputDto)
  @Role(['Owner'])
  async createRestaurant(
    @Args('input') input: CreateRestaurantInputType,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.restaurantService.createRestaurant(input, user);
  }
  @Mutation((returns) => CommonOutputDto)
  @Role(['Owner'])
  async updateRestaurant(
    @Args('input') input: UpdateRestaurantInputType,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.restaurantService.updateRestaurant(input, user);
  }
  @Mutation((returns) => CommonOutputDto)
  @Role(['Owner'])
  async deleteRestaurant(
    @Args('id') id: number,
    @CurrentUser() user: UserEntity,
  ): Promise<CommonOutputDto> {
    return await this.restaurantService.deleteRestaurant(id, user);
  }
  @Mutation((returns) => CommonOutputDto)
  @Role(['Client'])
  async rateRestaurant(
    @CurrentUser() user: UserEntity,
    @Args('input') input: RateInputType,
  ): Promise<CommonOutputDto> {
    return await this.restaurantService.rateRestaurant(user, input);
  }
}
