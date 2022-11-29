import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from '../../common/entities/core.entity';
import { CategoryEntity } from '../../category/category.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { CloudinaryContent } from '../../cloudinary/models';
import { IsJSON, IsOptional, IsString } from 'class-validator';

@InputType('GeoLocationInputType', { isAbstract: true })
@ObjectType()
export class GeoLocation {
  @Field((type) => Number)
  Latitude: number;
  @Field((type) => Number)
  Longitude: number;
}

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class RestaurantEntity extends CoreEntity {
  @Column({ type: 'varchar', nullable: false, unique: true, name: 'title' })
  @Field((type) => String, { name: 'title', nullable: false })
  @IsString()
  title: string;
  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
    name: 'description',
  })
  @Field((type) => String, { name: 'description', nullable: false })
  @IsString()
  description: string;
  @Column({ type: 'varchar', nullable: false, unique: true, name: 'address' })
  @Field((type) => String, { name: 'address', nullable: false })
  @IsString()
  address: string;
  @Column({ type: 'json', nullable: false, name: 'image' })
  @Field((type) => CloudinaryContent, { name: 'image', nullable: false })
  @IsJSON()
  image: CloudinaryContent;
  @Column({ type: 'json', nullable: true, name: 'teaser_video' })
  @Field((type) => CloudinaryContent, { name: 'teaserVideo', nullable: true })
  @IsJSON()
  @IsOptional()
  teaser_video?: CloudinaryContent;
  @Column({ type: 'json', nullable: true, name: 'geo_location' })
  @Field((type) => GeoLocation, { name: 'geoLocation', nullable: true })
  @IsJSON()
  @IsOptional()
  geoLocation?: GeoLocation;
  @ManyToOne((type) => CategoryEntity, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  @Field((type) => CategoryEntity)
  category: CategoryEntity;
  @ManyToOne((type) => UserEntity, (owner) => owner.restaurants)
  @Field((type) => UserEntity)
  owner: UserEntity;
  @RelationId((user: UserEntity) => user.id)
  ownerId: number;
}
