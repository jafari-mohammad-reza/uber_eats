import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { CommonOutputDto } from '../common/dtos/commonOutputDto';
import { CreateOrderInputType } from './dtos/create-order.dto';
import { CurrentUser } from '../decorators/current-user/current-user.decorator';
import { UserEntity } from '../users/user.entity';
import { Inject, UseGuards } from '@nestjs/common';
import {
  COOKED_ORDER,
  NEW_ORDER_UPDATE,
  NEW_PENDING_ORDER,
  PUB_SUB,
} from '../common/constants';
import { PubSub } from 'graphql-subscriptions';
import { UpdateOrderInput } from './dtos/update-order.dto';
import { GetOrderOutput, GetOrdersOutput } from './dtos/get-order.dto';
import { OrderEntity, OrderStatus } from './entities/order.entity';
import { Role } from '../decorators/role/roles.decorator';
import { RightRoleGuard } from '../guards/right-role/right-role.guard';

@Resolver()
@UseGuards(RightRoleGuard)
export class OrdersResolver {
  constructor(
    private readonly orderService: OrdersService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}
  @Query((returns) => GetOrdersOutput)
  @Role(['Any'])
  async getOrders(
    @CurrentUser() user: UserEntity,
    @Args('status') status: OrderStatus,
  ) {
    return await this.orderService.getOrders(user, status);
  }
  @Query((returns) => GetOrderOutput)
  @Role(['Owner', 'Delivery'])
  async getOrder(@CurrentUser() user: UserEntity, @Args('id') id: number) {
    return await this.orderService.getOrder(user, id);
  }
  @Mutation((returns) => CommonOutputDto)
  @Role(['Client'])
  async createOrder(
    @Args('input') input: CreateOrderInputType,
    @CurrentUser() user: UserEntity,
  ): Promise<CommonOutputDto> {
    return await this.orderService.createOrder(user, input);
  }
  @Mutation((returns) => CommonOutputDto)
  @Role(['Any'])
  async updateOrder(
    @Args('input') input: UpdateOrderInput,
    @CurrentUser() user: UserEntity,
  ): Promise<CommonOutputDto> {
    return await this.orderService.updateOrder(user, input);
  }
  @Subscription((returns) => OrderEntity, {
    filter: ({ ownerId }, variables, { user }) => {
      return ownerId === user.id;
    },
  })
  @Role(['Owner'])
  pendingOrders() {
    return this.pubSub.asyncIterator(NEW_PENDING_ORDER);
  }
  @Subscription((returns) => OrderEntity)
  @Role(['Delivery'])
  cookedOrders() {
    return this.pubSub.asyncIterator(COOKED_ORDER);
  }

  @Subscription((returns) => OrderEntity, {
    filter: (
      { orderUpdates: order }: { orderUpdates: OrderEntity },
      { input }: { input: UpdateOrderInput },
      { user }: { user: UserEntity },
    ) => {
      if (
        order.driverId['id'] !== user.id &&
        order.customerId['id'] !== user.id &&
        order.restaurant['id'] !== user.id
      ) {
        return false;
      }

      return order.id === input.id && order.status === input.status;
    },
  })
  @Role(['Any'])
  orderUpdates(@Args('input') orderUpdatesInput: UpdateOrderInput) {
    return this.pubSub.asyncIterator(NEW_ORDER_UPDATE);
  }

  @Mutation((returns) => CommonOutputDto)
  @Role(['Delivery'])
  takeOrder(
    @CurrentUser() driver: UserEntity,
    @Args('id') id: number,
  ): Promise<CommonOutputDto> {
    return this.orderService.takeOrder(driver, id);
  }
}
