import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { OrderItemOption } from '../entities/order-item.entity';

@ObjectType()
class OrderItem {
  @Field((type) => Int, { nullable: false })
  menuItemId: number;
  @Field((type) => [OrderItemOption], { nullable: true })
  options?: OrderItemOption[];
}
@InputType()
export class CreateOrderInputType {
  @Field((type) => Int, { nullable: false })
  restaurantId: number;
  @Field((type) => [OrderItem], { nullable: false })
  items: OrderItem[];
}
