import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { MenuItemEntity } from '../../menu-item/menu-item.entity';
import {
  IsArray,
  IsNotEmptyObject,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType('OrderItemOptionInputType', { isAbstract: true })
@ObjectType()
export class OrderItemOption {
  @Field((type) => String)
  @IsString()
  name: string;
  @Field((type) => String, { nullable: true })
  @IsString()
  choice: String;
}
@InputType('OrderItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItemEntity extends CoreEntity {
  @Field((type) => MenuItemEntity)
  @ManyToOne((type) => MenuItemEntity, {
    nullable: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  @IsNotEmptyObject()
  menuItem: MenuItemEntity;
  @Field((type) => [OrderItemOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  @IsArray()
  @IsOptional()
  options?: OrderItemOption[];
}
