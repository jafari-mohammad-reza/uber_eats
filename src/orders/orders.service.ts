import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity, OrderStatus } from './entities/order.entity';
import { Repository } from 'typeorm';
import { UserEntity, UserRoles } from '../users/user.entity';
import { CreateOrderInputType } from './dtos/create-order.dto';
import { CommonOutputDto } from '../common/dtos/commonOutputDto';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { MenuItemEntity } from '../menu-item/menu-item.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { GetOrderOutput, GetOrdersOutput } from './dtos/get-order.dto';
import { UpdateOrderInput } from './dtos/update-order.dto';
import {
  COOKED_ORDER,
  NEW_ORDER_UPDATE,
  NEW_PENDING_ORDER,
  PUB_SUB,
} from '../common/constants';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
    @InjectRepository(MenuItemEntity)
    private readonly menuItemRepository: Repository<MenuItemEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async getOrders(
    user: UserEntity,
    status: OrderStatus,
  ): Promise<GetOrdersOutput> {
    try {
      let orders: OrderEntity[];
      if (user.role === UserRoles.Client) {
        orders = await this.orderRepository.find({
          where: {
            customerId: user.id,
            ...(status && { status }),
          },
        });
      } else if (user.role === UserRoles.Delivery) {
        orders = await this.orderRepository.find({
          where: {
            driverId: user.id,
            ...(status && { status }),
          },
        });
      } else if (user.role === UserRoles.Owner) {
        const restaurants = await this.restaurantRepository.findBy({
          ownerId: user.id,
        });
        orders = restaurants.map((restaurant) => restaurant.orders).flat(1);
        if (status) {
          orders = orders.filter((order) => order.status === status);
        }
      }
      return {
        ok: true,
        error: null,
        orders,
      };
    } catch (err) {
      return {
        ok: false,
        error: err.message,
      };
    }
  }
  async getOrder(user: UserEntity, id: number): Promise<GetOrderOutput> {
    try {
      const order = await this.orderRepository.findOneBy({
        id,
      });
      if (!order) {
        return {
          ok: false,
          error: 'Order not found.',
        };
      }

      if (!this.canSeeOrder(user, order)) {
        return {
          ok: false,
          error: 'You cant see that',
        };
      }
      return {
        ok: true,
        order,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load order.',
      };
    }
  }
  async createOrder(
    user: UserEntity,
    { restaurantId, items }: CreateOrderInputType,
  ): Promise<CommonOutputDto> {
    try {
      const restaurant = await this.restaurantRepository.findOneBy({
        id: restaurantId,
      });
      if (!restaurant) {
        return {
          ok: false,
          error: 'There is no restaurant with this id',
        };
      }
      let selectedMenuItems: OrderItemEntity[] = [];
      let orderFinalPrice = 0;
      for (const item of items) {
        const menuItem = await this.menuItemRepository.findOneBy({
          id: item.menuItemId,
        });
        if (menuItem.restaurant.id !== restaurantId) {
          return {
            ok: false,
            error: "This restaurant does not have this item in it's menu",
          };
        }
        if (!menuItem) {
          return {
            ok: false,
            error: 'menuItem not found.',
          };
        }
        let menuItemFinalPrice = menuItem.price;
        if (item.options) {
          for (const option of item.options) {
            const menuItemOption = menuItem.options.find(
              (menuItemOption) => menuItemOption.name === option.name,
            );
            if (menuItemOption) {
              if (menuItemOption.extra) {
                menuItemFinalPrice = menuItem.price + menuItemOption.extra;
              } else {
                const menuItemOptionChoice = menuItemOption.choices?.find(
                  (optionChoice) => optionChoice.name === option.choice,
                );
                if (menuItemOptionChoice) {
                  if (menuItemOptionChoice.extra) {
                    menuItemFinalPrice =
                      menuItemFinalPrice + menuItemOptionChoice.extra;
                  }
                }
              }
            }
          }
        }
        orderFinalPrice = orderFinalPrice + menuItemFinalPrice;
        const orderItem = await this.orderItemRepository.save(
          this.orderItemRepository.create({
            menuItem,
            options: item.options,
          }),
        );
        selectedMenuItems.push(orderItem);
      }

      const newOrder = await this.orderRepository.save(
        this.orderRepository.create({
          customer: user,
          restaurant,
          totalCost: orderFinalPrice,
          items: selectedMenuItems,
        }),
      );
      await this.pubSub.publish(NEW_PENDING_ORDER, {
        pendingOrders: newOrder,
        ownerId: restaurant.owner.id,
      });
      return {
        ok: true,
        error: null,
      };
    } catch (e) {
      return {
        ok: false,
        error: e.message,
      };
    }
  }
  async updateOrder(
    user: UserEntity,
    { id, status }: UpdateOrderInput,
  ): Promise<CommonOutputDto> {
    try {
      const order = await this.orderRepository.findOneBy({
        id,
      });
      if (!order) {
        return {
          ok: false,
          error: 'Order not found.',
        };
      }
      if (!this.canSeeOrder(user, order)) {
        return {
          ok: false,
          error: "Can't see this.",
        };
      }
      if (user.role === 'Client' && status !== OrderStatus.Canceled) {
        return {
          ok: false,
          error: 'You can only cancel the order.',
        };
      }
      if (
        status === OrderStatus.Canceled &&
        (order.status === OrderStatus.PickedUp ||
          order.status === OrderStatus.Delivered)
      ) {
        return {
          ok: false,
          error: 'Its to late for canceling the order.',
        };
      }
      await this.orderRepository.save({ id, status });
      const newOrder = { ...order, status };
      if (user.role == UserRoles.Owner) {
        if (order.status === OrderStatus.Cooked) {
          await this.pubSub.publish(COOKED_ORDER, {
            cookedOrders: newOrder,
          });
        }
      }
      await this.pubSub.publish(NEW_ORDER_UPDATE, { orderUpdates: newOrder });

      return {
        ok: true,
        error: null,
      };
    } catch (err) {
      return {
        ok: false,
        error: err.message,
      };
    }
  }
  async takeOrder(driver: UserEntity, id: number): Promise<CommonOutputDto> {
    try {
      const order = await this.orderRepository.findOneBy({ id });
      if (!order) {
        return {
          ok: false,
          error: 'Order not found',
        };
      }
      if (order.driver) {
        return {
          ok: false,
          error: 'This order already has a driver',
        };
      }
      await this.orderRepository.save({
        id,
        driver,
      });
      await this.pubSub.publish(NEW_ORDER_UPDATE, {
        orderUpdates: { ...order, driver },
      });
      return {
        ok: true,
      };
    } catch (err) {
      return {
        ok: false,
        error: err.message,
      };
    }
  }

  canSeeOrder(user: UserEntity, order: OrderEntity): boolean {
    let canSee = true;
    if (user.role === UserRoles.Client && order.customerId['id'] !== user.id) {
      canSee = false;
    }
    if (user.role === UserRoles.Delivery && order.driverId['id'] !== user.id) {
      canSee = false;
    }
    if (
      user.role === UserRoles.Owner &&
      order.restaurant.ownerId['id'] !== user.id
    ) {
      canSee = false;
    }
    return canSee;
  }
}
