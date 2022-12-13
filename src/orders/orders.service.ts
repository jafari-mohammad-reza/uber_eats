import { Injectable } from '@nestjs/common';
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
import { EditOrderInput } from './dtos/edit-order.dto';

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
  ) {}
  async createOrder(
    user: UserEntity,
    { restaurantId, items }: CreateOrderInputType,
  ): Promise<CommonOutputDto> {
    try {
      const restaurant = await this.restaurantRepository.findOne({
        where: { id: restaurantId },
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
        if (!menuItem) {
          return {
            ok: false,
            error: 'menuItem not found.',
          };
        }
        let menuItemFinalPrice = menuItem.price;
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
        orderFinalPrice = orderFinalPrice + menuItemFinalPrice;
        const orderItem = await this.orderItemRepository.save(
          this.orderItemRepository.create({
            menuItem,
            options: item.options,
          }),
        );
        selectedMenuItems.push(orderItem);
      }

      await this.orderRepository.save(
        this.orderRepository.create({
          customer: user,
          restaurant,
          totalCost: orderFinalPrice,
          items: selectedMenuItems,
        }),
      );
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
        const restaurants = await this.restaurantRepository.find({
          where: {
            ownerId: user.id,
          },
          relations: ['orders'],
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
      const order = await this.orderRepository.findOne({
        where: {
          id,
        },
        relations: ['restaurant'],
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

  async editOrder(
    user: UserEntity,
    { id: orderId, status }: EditOrderInput,
  ): Promise<CommonOutputDto> {
    try {
      const order = await this.orderRepository.findOneBy({ id: orderId });
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
      let canEdit = true;
      if (user.role === UserRoles.Client) {
        canEdit = false;
      }
      if (user.role === UserRoles.Owner) {
        if (status !== OrderStatus.Cooking && status !== OrderStatus.Cooked) {
          canEdit = false;
        }
      }
      if (user.role === UserRoles.Delivery) {
        if (
          status !== OrderStatus.PickedUp &&
          status !== OrderStatus.Delivered
        ) {
          canEdit = false;
        }
      }
      if (!canEdit) {
        return {
          ok: false,
          error: "You can't do that.",
        };
      }
      await this.orderRepository.save({
        id: orderId,
        status,
      });

      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not edit order.',
      };
    }
  }

  canSeeOrder(user: UserEntity, order: OrderEntity): boolean {
    let canSee = true;
    if (user.role === UserRoles.Client && order.customerId !== user.id) {
      canSee = false;
    }
    if (user.role === UserRoles.Delivery && order.driverId !== user.id) {
      canSee = false;
    }
    if (user.role === UserRoles.Owner && order.restaurant.ownerId !== user.id) {
      canSee = false;
    }
    return canSee;
  }
}
