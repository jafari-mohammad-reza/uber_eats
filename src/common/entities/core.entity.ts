import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

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
<<<<<<< HEAD
=======

>>>>>>> master
@InputType('GeoLocationInputType', { isAbstract: true })
@ObjectType()
export class GeoLocation {
  @Field((type) => Number)
  Latitude: number;
  @Field((type) => Number)
  Longitude: number;
}
