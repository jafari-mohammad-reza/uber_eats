import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { CloudinaryContent } from '../../cloudinary/models';
import { RestaurantEntity } from './restaurant.entity';
import { IsJSON, IsString } from 'class-validator';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class CategoryEntity extends CoreEntity {
  @Column({ type: 'varchar', nullable: false, unique: true, name: 'title' })
  @Field((type) => String, { name: 'title', nullable: false })
  @IsString()
  title: string;
  @Column({ type: 'json', nullable: false, name: 'image' })
  @Field((type) => CloudinaryContent, { name: 'image', nullable: false })
  @IsJSON()
  image: CloudinaryContent;
  @OneToMany((type) => RestaurantEntity, (restaurant) => restaurant.category)
  @Field((type) => [RestaurantEntity])
  restaurants?: RestaurantEntity[];
}
