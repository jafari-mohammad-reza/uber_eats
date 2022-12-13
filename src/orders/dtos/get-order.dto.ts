import { CommonOutputDto } from '../../common/dtos/commonOutputDto';
import { Field, ObjectType } from '@nestjs/graphql';
import { OrderEntity } from '../entities/order.entity';

@ObjectType()
export class GetOrdersOutput extends CommonOutputDto {
  @Field((type) => [OrderEntity], { nullable: true })
  orders?: OrderEntity[];
}
@ObjectType()
export class GetOrderOutput extends CommonOutputDto {
  @Field((type) => OrderEntity, { nullable: true })
  order?: OrderEntity;
}
