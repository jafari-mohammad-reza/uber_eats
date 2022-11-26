import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { UserEntity } from '../entities/user.entity';
import { CoreOutputDto } from '../../common/dtos/common-output.dto';

@InputType()
export class LoginUserInput extends PickType(UserEntity, [
  'email',
  'password',
]) {}

@ObjectType()
export class LoginUserOutput extends CoreOutputDto {
  @Field((type) => String, { name: 'token', nullable: true })
  token?: string;
}
