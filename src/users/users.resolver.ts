import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import {
  RegisterUserInput,
  RegisterUserOutput,
} from './dtos/register-user.dto';
import { LoginUserInput, LoginUserOutput } from './dtos/login-user.dto';
import { ExecutionContext, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth/auth.guard';
import { CurrentUser } from '../decorators/current-user/current-user.decorator';
import { CommonOutputDto } from '../common/dtos/common-output.dto';
import {
  ChangePasswordInput,
  ResetPasswordInput,
} from './dtos/reset-password.dto';
import { EmailDto } from './dtos/email.dto';
import { VerifyUserDto } from './dtos/verify-user.dto';

@Resolver((resolver) => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => UserEntity)
  @UseGuards(AuthGuard)
  profile(@CurrentUser() profile: UserEntity) {
    return profile;
  }

  @Mutation((returns) => RegisterUserOutput)
  async registerUser(
    @Args('input') RegisterUserInput: RegisterUserInput,
  ): Promise<RegisterUserOutput> {
    try {
      return this.usersService.registerUser(RegisterUserInput);
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  @Mutation((returns) => LoginUserOutput)
  async loginUser(
    @Args('input') loginUserInput: LoginUserInput,
    @Context() context: ExecutionContext,
  ): Promise<LoginUserOutput> {
    try {
      return await this.usersService.loginUser(loginUserInput);
    } catch (e) {
      return { ok: false, error: e.message, token: null };
    }
  }

  @Mutation((returns) => CommonOutputDto)
  async verifyUser(@Args('input') { verificationCode }: VerifyUserDto) {
    return await this.usersService.verifyAccount(verificationCode);
  }

  @Mutation((returns) => CommonOutputDto)
  async resendVerificationCode(@Args('input') { email }: EmailDto) {
    return await this.usersService.resendVerificationCode(email);
  }

  @Mutation((returns) => CommonOutputDto)
  async forgotPassword(@Args('input') { email }: EmailDto) {
    return await this.usersService.sendResetPasswordLink(email);
  }

  @Mutation((returns) => CommonOutputDto)
  async resetPassword(@Args('input') resetPasswordInput: ResetPasswordInput) {
    return await this.usersService.resetPassword(resetPasswordInput);
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => CommonOutputDto)
  async changePassword(
    @Args('input') { password, confirmPassword }: ChangePasswordInput,
    @CurrentUser() user: UserEntity,
  ) {
    return this.usersService.changePassword(user, password);
  }
}
