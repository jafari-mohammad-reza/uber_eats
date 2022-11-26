import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from '../common/entities/core.entity';
import { IsString } from 'class-validator';
import {
  CloudinaryContent,
  RestaurantEntity,
} from '../restaurant/restaurant.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class CategoryEntity extends CoreEntity {
  @Column({ type: 'varchar', nullable: false, name: 'name' })
  @Field((type) => String, {
    nullable: false,
    name: 'name',
    description: 'name of category',
  })
  @IsString()
  name: string;
  @Column({ type: 'json', nullable: false, name: 'coverImage' })
  @Field((type) => CloudinaryContent, {
    nullable: false,
    name: 'coverImage',
  })
  coverImage: CloudinaryContent;
  @OneToMany((type) => RestaurantEntity, (restaurant) => restaurant.category)
  @Field((type) => [RestaurantEntity])
  restaurants: RestaurantEntity[];
}
