import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from '../common/entities/core.entity';
import {
  IsLatitude,
  IsLongitude,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { CategoryEntity } from '../category/category.entity';
import { GraphQLJSON } from 'graphql-type-json';
import { UserEntity } from '../users/entities/user.entity';

@InputType('RestaurantContentType', { isAbstract: true })
@ObjectType()
export class CloudinaryContent {
  @Field((type) => String)
  url: string;
  @Field((type) => String)
  publicId: string;
}
@InputType('GeoLocationType', { isAbstract: true })
@ObjectType()
export class GeoLocation {
  @Field((type) => String)
  longitude: string;
  @Field((type) => String)
  latitude: string;
}

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class RestaurantEntity extends CoreEntity {
  @Column({ type: 'varchar', nullable: false, name: 'name' })
  @Field((type) => String, {
    nullable: false,
    name: 'name',
    description: 'name of restaurant',
  })
  @IsString()
  name: string;
  @Column({ type: 'varchar', nullable: true, name: 'description' })
  @Field((type) => String, {
    nullable: true,
    name: 'description',
  })
  @IsString()
  @IsOptional()
  description?: string;
  @Column({ type: 'json', nullable: false, name: 'coverImage' })
  @Field((type) => CloudinaryContent, {
    nullable: false,
    name: 'coverImage',
  })
  coverImage: CloudinaryContent;
  @Column({ type: 'json', nullable: true, name: 'teaserVideo' })
  @Field((type) => CloudinaryContent, {
    nullable: true,
    name: 'teaserVideo',
  })
  @IsOptional()
  teaserVideo: CloudinaryContent;
  @Column({ type: 'varchar', nullable: false, name: 'address' })
  @Field((type) => String, {
    nullable: false,
    name: 'address',
  })
  @IsString()
  address: string;
  @Column({ type: 'json', nullable: true, name: 'geoLocation' })
  @Field((type) => GeoLocation, { nullable: true })
  @IsOptional()
  geoLocation?: GeoLocation;
  @ManyToOne((type) => CategoryEntity, (category) => category.restaurants, {
    nullable: false,
    onDelete: 'SET NULL',
  })
  @Field((type) => CategoryEntity, { nullable: false })
  category: CategoryEntity;
  @RelationId((restaurant: RestaurantEntity) => restaurant.category)
  categoryId: number;
  @ManyToOne((type) => UserEntity, (user) => user.restaurants, {
    nullable: false,
    onDelete: 'SET NULL',
  })
  @Field((type) => UserEntity, { nullable: false })
  owner: UserEntity;
  @RelationId((restaurant: RestaurantEntity) => restaurant.owner)
  ownerId: number;
}
