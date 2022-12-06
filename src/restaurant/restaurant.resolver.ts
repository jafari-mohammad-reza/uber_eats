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
import { UserEntity } from '../users/entities/user.entity';

@Resolver((of) => RestaurantEntity)
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
  async createRestaurant(
    @Args('input') input: CreateRestaurantInputType,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.restaurantService.createRestaurant(input, user);
  }
  @Mutation((returns) => CommonOutputDto)
  async updateRestaurant(
    @Args('input') input: UpdateRestaurantInputType,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.restaurantService.updateRestaurant(input);
  }
  @Mutation((returns) => CommonOutputDto)
  async deleteRestaurant(@Args('id') id: number): Promise<CommonOutputDto> {
    return await this.restaurantService.deleteRestaurant(id);
  }
}
