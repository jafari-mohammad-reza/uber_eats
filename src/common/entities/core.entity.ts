import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsLatitude, IsLongitude } from 'class-validator';

export class CoreEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => Number, { nullable: false, name: 'id' })
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
