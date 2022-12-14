import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsLatitude, IsLongitude, IsNumber, Max, Min } from 'class-validator';
import { GraphQLFloat } from 'graphql/type';

@InputType({ isAbstract: true })
export class CoreEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => Number, { nullable: false, name: 'id' })
  @IsNumber()
  id: number;
  @CreateDateColumn({ name: 'createdAt', type: 'date' })
  @Field((type) => Date)
  createdAt: Date;
  @UpdateDateColumn({ name: 'updatedAt', type: 'date' })
  @Field((type) => Date)
  updatedAt: Date;
  @Column({ default: true })
  @Field((type) => Boolean, { defaultValue: true })
  isActive: Boolean;
}

@InputType('GeoLocationInputType', { isAbstract: true })
@ObjectType()
export class GeoLocation {
  @Field((type) => Number)
  @IsLatitude()
  Latitude: number;
  @Field((type) => Number)
  @IsLongitude()
  Longitude: number;
}

@InputType('RatingInputType', { isAbstract: true })
@ObjectType()
export class Rate {
  @Field((type) => Int, { nullable: false })
  @IsNumber()
  userId: number;
  @Field((type) => GraphQLFloat, { nullable: false })
  @IsNumber()
  @Min(0)
  @Max(5)
  stars: number;
}
