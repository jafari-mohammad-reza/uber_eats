import { InputType, PickType } from '@nestjs/graphql';
import { OrderEntity } from '../entities/order.entity';

@InputType()
export class UpdateOrderInput extends PickType(OrderEntity, ['id', 'status']) {}
