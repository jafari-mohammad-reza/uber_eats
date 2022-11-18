import { Field, InputType, PickType } from '@nestjs/graphql';
import { RegisterUserInput } from './register-user.dto';
import { IsJWT } from 'class-validator';

@InputType()
export class ResetPasswordInput extends PickType(RegisterUserInput, [
  'password',
  'confirmPassword',
]) {
  @Field((type) => String, { name: 'token', nullable: false })
  @IsJWT({ message: 'Invalid jwt token' })
  token: string;
}

@InputType()
export class ChangePasswordInput extends PickType(RegisterUserInput, [
  'password',
  'confirmPassword',
]) {}
