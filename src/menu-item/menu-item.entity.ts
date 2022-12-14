import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, ManyToOne, RelationId } from 'typeorm';
import { CoreEntity, Rate } from '../common/entities/core.entity';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { GraphQLFloat } from 'graphql/type';
import { CloudinaryContent } from '../cloudinary/models';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { OrderEntity } from '../orders/entities/order.entity';

@InputType('MenuItemChoiceInputType', { isAbstract: true })
@ObjectType()
export class MenuItemChoice {
  @Field((type) => String)
  name: string;
  @Field((type) => Int, { nullable: true })
  extra?: number;
}
@InputType('MenuItemOptionInputType', { isAbstract: true })
@ObjectType()
export class MenuItemOption {
  @Field((type) => String)
  name: string;
  @Field((type) => [MenuItemChoice], { nullable: true })
  choices?: MenuItemChoice[];
  @Field((type) => Int, { nullable: true })
  extra?: number;
}

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class MenuItemEntity extends CoreEntity {
  @Column({ type: 'varchar', nullable: false, name: 'name' })
  @Field((type) => String, { nullable: false })
  @IsString()
  @Length(5)
  name: string;
  @Column({ type: 'float', nullable: false, name: 'price' })
  @Field((type) => GraphQLFloat, { nullable: false })
  @IsNumber()
  price: number;
  @Column({ type: 'json', nullable: true })
  @Field((type) => CloudinaryContent, { nullable: true })
  @IsObject()
  coverImage?: CloudinaryContent;

  @Column({ type: 'varchar', nullable: true })
  @Field((type) => String, { nullable: true })
  @Length(5, 140)
  @IsOptional()
  description?: string;

  @Field((type) => RestaurantEntity)
  @ManyToOne((type) => RestaurantEntity, (restaurant) => restaurant.menu, {
    onDelete: 'CASCADE',
  })
  restaurant: RestaurantEntity;

  @RelationId((menuItem: MenuItemEntity) => menuItem.restaurant)
  restaurantId: number;

  @Column({ type: 'json', nullable: true })
  @Field((type) => [MenuItemOption], { nullable: true })
  @IsOptional()
  @IsArray()
  options?: MenuItemOption[];
  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  @Field((type) => [Rate], { nullable: false })
  ratings: Array<Rate>;
  @Field((type) => GraphQLFloat, { name: 'averageRating', nullable: true })
  averageRating?: number;
  @ManyToMany((type) => OrderEntity, (order) => order.items)
  orders: OrderEntity[];
  getAverageRatings() {
    let totalStars = 0;
    this.ratings.forEach((rate) => (totalStars += rate.stars));
    this.averageRating = totalStars / this.ratings.length;
  }
}
