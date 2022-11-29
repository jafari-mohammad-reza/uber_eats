import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { UserEntity } from '../entities/user.entity';
import { CommonOutputDto } from '../../common/dtos/commonOutputDto';

@InputType()
export class LoginUserInput extends PickType(UserEntity, [
  'email',
  'password',
]) {}

@ObjectType()
export class LoginUserOutput extends CommonOutputDto {
  @Field((type) => String, { name: 'token', nullable: true })
  token?: string;
}
