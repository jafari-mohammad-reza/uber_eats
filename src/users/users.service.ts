import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { FindOptionsSelect, Repository } from 'typeorm';
import { RegisterUserInput } from './dtos/register-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserInput } from './dtos/login-user.dto';
import * as bcrypt from 'bcrypt';
import { CoreOutputDto } from '../common/dtos/common-output.dto';
import { ResetPasswordInput } from './dtos/reset-password.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async registerUser({
    email,
    password,
    role,
  }: RegisterUserInput): Promise<{ ok: boolean; error?: string }> {
    try {
      const existUser: UserEntity | null = await this.findUserByEmail(email);
      if (existUser) return { ok: false, error: 'Invalid email address' };
      const verificationCode = Math.floor(100000 + Math.random() * 900000); // generates 6 digits number
      await this.userRepository.save(
        this.userRepository.create({ email, password, role, verificationCode }),
      );
      this.mailService.sendVerificationCode(email, verificationCode.toString());
      return { ok: true, error: null };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async loginUser({
    email,
    password,
  }: LoginUserInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    try {
      const existUser: UserEntity | null = await this.findUserByEmail(email);
      if (!existUser)
        return {
          ok: false,
          token: null,
          error: 'Make sure to insert your credentials correctly',
        };
      if (!existUser.isVerified)
        return {
          ok: false,
          token: null,
          error: 'Make sure to verify your account first',
        };
      if (!bcrypt.compareSync(password, existUser.password))
        return {
          ok: false,
          token: null,
          error: 'Make sure to insert your credentials correctly',
        };
      const token = await this.jwtService.signAsync(email);
      return { ok: true, error: null, token };
    } catch (e) {
      return { ok: false, error: e.message, token: null };
    }
  }

  async findUserByEmail(
    email: string,
    select?: FindOptionsSelect<UserEntity>,
  ): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { email }, select });
  }

  async decodeToken(token: string): Promise<Object> {
    return await this.jwtService.verifyAsync(token);
  }

  async verifyAccount(verificationCode: number): Promise<CoreOutputDto> {
    try {
      const user = await this.userRepository.findOneBy({
        verificationCode: verificationCode,
      });
      if (!user)
        return { ok: false, error: 'Please insert valid verification code' };
      await this.userRepository.update(
        { id: user.id },
        { verificationCode: null, isVerified: true },
      );
      return { ok: true, error: null };
    } catch (e) {
      return {
        ok: false,
        error: e.message,
      };
    }
  }

  async resendVerificationCode(email: string): Promise<CoreOutputDto> {
    try {
      const user: UserEntity | null = await this.findUserByEmail(email);
      if (!user)
        return { ok: false, error: 'Please insert exist email address' };
      if (user.isVerified)
        return { ok: false, error: 'Your account is already verified' };
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      this.mailService.sendVerificationCode(
        user.email,
        verificationCode.toString(),
      );
      await this.userRepository.update({ id: user.id }, { verificationCode });
      return { ok: true, error: null };
    } catch (e) {
      return {
        ok: false,
        error: e.message,
      };
    }
  }

  async sendResetPasswordLink(email: string): Promise<CoreOutputDto> {
    try {
      const user: UserEntity | null = await this.findUserByEmail(email);
      if (!user)
        return { ok: false, error: 'Please insert exist email address' };
      if (user.resetPasswordAttempts >= 3)
        return {
          ok: false,
          error: 'You have reached maximum reset password attempts',
        };
      const resetPasswordToken = await this.jwtService.signAsync(
        user.id.toString(),
      );
      const link = `${process.env.CLIENT_ADDRESS}/auth/reset_password/${resetPasswordToken}`;
      this.mailService.sendEmail(
        user.email,
        'Reset your password',
        `<a href=${link}>Please reset your password with this link</a>`,
      );
      return { ok: true, error: null };
    } catch (e) {
      return {
        ok: false,
        error: e.message,
      };
    }
  }

  async resetPassword({
    token,
    password,
  }: ResetPasswordInput): Promise<CoreOutputDto> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      const user = await this.userRepository.findOneBy({ id: Number(decoded) });
      if (!user) return { ok: false, error: 'user not found' };
      return await this.changePassword(user, password);
    } catch (e) {
      return {
        ok: false,
        error: e.message,
      };
    }
  }

  async changePassword(
    user: UserEntity,
    password: string,
  ): Promise<CoreOutputDto> {
    try {
      if (user.resetPasswordAttempts >= 3)
        return {
          ok: false,
          error: 'You have reached maximum reset password attempts',
        };
      if (bcrypt.compareSync(password, user.password))
        return { ok: false, error: 'You cannot use your old password again' };
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.userRepository.update(
        { id: user.id },
        {
          password: hashedPassword,
          resetPasswordAttempts: user.resetPasswordAttempts + 1,
        },
      );
      return { ok: true, error: null };
    } catch (e) {
      return {
        ok: false,
        error: e.message,
      };
    }
  }
}
