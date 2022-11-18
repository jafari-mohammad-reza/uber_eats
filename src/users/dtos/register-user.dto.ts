import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { UserEntity } from '../entities/user.entity';
import { IsString, Length } from 'class-validator';
import { CommonOutputDto } from '../../common/dtos/common-output.dto';
import { Match } from '../../common/decorators/match.decorator';

@InputType()
export class RegisterUserInput extends PickType(UserEntity, [
  'email',
  'password',
  'role',
]) {
  @Field((type) => String, {
    nullable: false,
    name: 'confirmPassword',
    description:
      'user confirmPassword containing Capital and lower case letters and numbers',
  })
  @IsString()
  @Length(8, 16)
  @Match('password', { message: 'passwords does not match' })
  confirmPassword: string;
}

@ObjectType()
export class RegisterUserOutput extends CommonOutputDto {}
