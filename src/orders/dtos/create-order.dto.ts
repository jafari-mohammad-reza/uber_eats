import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { OrderItemOption } from '../entities/order-item.entity';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

@InputType('OrderItemInputType', { isAbstract: true })
@ObjectType()
class OrderItem {
  @Field((type) => Int, { nullable: false })
  @IsNumber()
  menuItemId: number;
  @Field((type) => [OrderItemOption], { nullable: true })
  @IsArray()
  @IsOptional()
  options?: OrderItemOption[];
}
@InputType()
export class CreateOrderInputType {
  @Field((type) => Int, { nullable: false })
  @IsNumber()
  restaurantId: number;
  @Field((type) => [OrderItem], { nullable: false })
  @IsArray()
  items: OrderItem[];
}
