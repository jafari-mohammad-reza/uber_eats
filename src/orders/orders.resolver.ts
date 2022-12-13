import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { CommonOutputDto } from '../common/dtos/commonOutputDto';
import { CreateOrderInputType } from './dtos/create-order.dto';
import { CurrentUser } from '../decorators/current-user/current-user.decorator';
import { UserEntity } from '../users/user.entity';

@Resolver()
export class OrdersResolver {
  constructor(private readonly orderService: OrdersService) {}
  @Mutation((returns) => CommonOutputDto)
  async createOrder(
    @Args('input') input: CreateOrderInputType,
    @CurrentUser() user: UserEntity,
  ): Promise<CommonOutputDto> {
    return await this.orderService.createOrder(user, input);
  }
}
