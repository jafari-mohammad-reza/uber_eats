import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, Max, Min } from 'class-validator';
import { GraphQLFloat } from 'graphql/type';

@InputType({ isAbstract: true })
export class RateInputType {
  @Field((type) => Int, { nullable: false })
  @IsNumber()
  targetId: number;
  @Field((type) => GraphQLFloat, { nullable: false })
  @IsNumber()
  @Min(0)
  @Max(5)
  stars: number;
}
