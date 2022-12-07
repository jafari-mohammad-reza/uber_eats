import { CoreEntity, GeoLocation, Rate } from '../common/entities/core.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { CloudinaryContent } from '../cloudinary/models';
import { CategoryEntity } from '../category/category.entity';
import { UserEntity } from '../users/user.entity';
import { MenuItemEntity } from '../menu-item/menu-item.entity';
import { GraphQLFloat } from 'graphql/type';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class RestaurantEntity extends CoreEntity {
  @Column({ type: 'varchar', nullable: false, name: 'title' })
  @Field((type) => String, {
    nullable: false,
    name: 'title',
    description: 'name of restaurant',
  })
  @IsString()
  title: string;
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
  @IsObject()
  coverImage: CloudinaryContent;
  @Column({ type: 'json', nullable: true, name: 'teaserVideo' })
  @Field((type) => CloudinaryContent, {
    nullable: true,
    name: 'teaserVideo',
  })
  @IsObject()
  @IsOptional()
  teaserVideo?: CloudinaryContent;
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
  @IsObject()
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
  @OneToMany((type) => MenuItemEntity, (menuItem) => menuItem.restaurant)
  @Field((type) => [MenuItemEntity], { nullable: true })
  menu: MenuItemEntity[];
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
  getAverageRatings() {
    let totalStars = 0;
    this.ratings.forEach((rate) => (totalStars += rate.stars));
    this.averageRating = totalStars / this.ratings.length;
  }
}
