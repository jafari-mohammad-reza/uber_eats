import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { MenuItemEntity } from '../../menu-item/menu-item.entity';

@InputType('OrderItemOptionInputType', { isAbstract: true })
@ObjectType()
export class OrderItemOption {
  @Field((type) => String)
  name: string;
  @Field((type) => String, { nullable: true })
  choice: String;
}
@InputType('OrderItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItemEntity extends CoreEntity {
  @Field((type) => MenuItemEntity)
  @ManyToOne((type) => MenuItemEntity, { nullable: true, onDelete: 'CASCADE' })
  menuItem: MenuItemEntity;
  @Field((type) => [OrderItemOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: OrderItemOption[];
}
