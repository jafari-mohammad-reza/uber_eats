import { Resolver } from '@nestjs/graphql';
import { RestaurantService } from '../services/restaurant/restaurant.service';

@Resolver()
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}
}
