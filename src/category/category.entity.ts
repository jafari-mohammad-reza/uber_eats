import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from '../common/entities/core.entity';
import { IsObject, IsString } from 'class-validator';
import { CloudinaryContent } from '../cloudinary/models';
import { RestaurantEntity } from '../restaurant/restaurant.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class CategoryEntity extends CoreEntity {
  @Column({ type: 'varchar', nullable: false, unique: true, name: 'title' })
  @Field((type) => String, { name: 'title', nullable: false })
  @IsString()
  title: string;
  @Column({ type: 'json', nullable: false, name: 'image' })
  @Field((type) => CloudinaryContent, { nullable: false })
  @IsObject()
  image: CloudinaryContent;
  @OneToMany((type) => RestaurantEntity, (restaurant) => restaurant.category)
  @Field((type) => [RestaurantEntity], { nullable: true })
  restaurants?: RestaurantEntity[];
}
