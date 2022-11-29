import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

@ObjectType()
export class CommonOutputDto {
  @Field((type) => String, { nullable: true })
  error?: string;
  @Field((type) => Boolean)
  ok: boolean;
}

@InputType()
export class CommonInputDto {
  @Field((type) => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  page?: number;
  @Field((type) => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  take?: number;
}
