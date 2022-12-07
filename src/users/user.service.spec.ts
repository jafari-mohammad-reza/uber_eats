import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity, UserRoles } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { MockRepositoryType } from '../common/types/testing.types';
import * as bcrypt from 'bcrypt';

const mockRepository = {
  save: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
};
const mockJwtService = {
  sign: jest.fn(),
  signAsync: jest.fn(() => 'TOKEN'),
  verify: jest.fn(),
  verifyAsync: jest.fn((input) => input.toString()),
  decode: jest.fn(),
};
const mockMailService = {
  sendVerificationCode: jest.fn(),
  sendEmail: jest.fn(),
};

describe('UserService', function () {
  let service: UsersService;
  let mailService: MailService;
  let userRepository: MockRepositoryType<UserEntity>;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        JwtService,
        { provide: getRepositoryToken(UserEntity), useValue: mockRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    mailService = module.get<MailService>(MailService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });
  it('should UserService be defined', function () {
    expect(service).toBeDefined();
  });
  describe('registerUser', function () {
    it('should return ok', async function () {
      userRepository.findOne.mockResolvedValue(undefined);
      const result = await service.registerUser({
        email: 'test@test.com',
        password: 'Test123',
        confirmPassword: 'Test123',
        role: UserRoles.Client,
      });
      expect(result).toMatchObject({ ok: true, error: null });
    });
    it('should fail for existing user', async function () {
      userRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
      });
      const result = await service.registerUser({
        email: '',
        password: '',
        confirmPassword: '',
        role: UserRoles.Client,
      });
      expect(result).toMatchObject({
        ok: false,
        error: 'Invalid email address',
      });
    });
    it('should fail on exception', async function () {
      const error = new Error('Error');
      userRepository.findOne.mockRejectedValue(error);
      const result = await service.registerUser({
        email: '',
        password: '',
        confirmPassword: '',
        role: UserRoles.Client,
      });
      expect(result).toMatchObject({ ok: false, error: error.message });
    });
  });
  describe('Login user', function () {
    it('should login successfully', async function () {
      userRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: bcrypt.hashSync('Test123', 10),
        isVerified: true,
      });
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);
      const result = await service.loginUser({
        email: 'test@test.com',
        password: 'Test123',
      });
      expect(result).toMatchObject({ ok: true, token: 'TOKEN', error: null });
    });
    it('should login fail user not found', async function () {
      userRepository.findOne.mockResolvedValue(null);
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);
      const result = await service.loginUser({
        email: 'test@test.com',
        password: 'Test123',
      });
      expect(result).toMatchObject({
        ok: false,
        token: null,
        error: 'Make sure to insert your credentials correctly',
      });
    });
    it('should login fail user password is wrong', async function () {
      userRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: bcrypt.hashSync('Test1234', 10),
        isVerified: true,
      });
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);
      const result = await service.loginUser({
        email: 'test@test.com',
        password: 'Test123',
      });
      expect(result).toMatchObject({
        ok: false,
        token: null,
        error: 'Make sure to insert your credentials correctly',
      });
    });
    it('should login fail user is not verified', async function () {
      userRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: 'Test1234',
        isVerified: false,
      });
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);
      const result = await service.loginUser({
        email: 'test@test.com',
        password: 'Test123',
      });
      expect(result).toMatchObject({
        ok: false,
        token: null,
        error: 'Make sure to verify your account first',
      });
    });
    it('should login fail on exception', async function () {
      const error = new Error('Error');
      userRepository.findOne.mockRejectedValue(error);
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);
      const result = await service.loginUser({
        email: 'test@test.com',
        password: 'Test123',
      });
      expect(result).toMatchObject({
        ok: false,
        error: error.message,
        token: null,
      });
    });
  });
  describe('findUserByEmail', function () {
    it('should return existing user', async function () {
      userRepository.findOne.mockResolvedValue({
        email: 'test@test.com',
        password: 'Test123',
      });
      const result = await service.findUserByEmail('test@test.com');
      expect(result).toMatchObject({
        email: 'test@test.com',
        password: 'Test123',
      });
    });
    it('should return existing user', async function () {
      userRepository.findOne.mockResolvedValue(null);
      const result = await service.findUserByEmail('test@test.com');
      expect(result).toEqual(null);
    });
  });
  describe('verifyAccount', function () {
    it('should Verify account correctly', async function () {
      const verificationCode = 123456;
      userRepository.findOneBy.mockResolvedValue({
        email: 'test@test.com',
        password: 'Test123',
      });
      const result = await service.verifyAccount(verificationCode);
      expect(result).toMatchObject({ ok: true, error: null });
    });
    it('should Verify fail user not exist', async function () {
      const verificationCode = 123456;
      userRepository.findOneBy.mockResolvedValue(null);
      const result = await service.verifyAccount(verificationCode);
      expect(result).toMatchObject({
        ok: false,
        error: 'Please insert valid verification code',
      });
    });
    it('should Verify fail error happen', async function () {
      const verificationCode = 123456;
      const error = new Error('Error');
      userRepository.findOneBy.mockRejectedValue(error);
      const result = await service.verifyAccount(verificationCode);
      expect(result).toMatchObject({
        ok: false,
        error: error.message,
      });
    });
  });
  describe('resendVerificationCode', function () {
    it('should resendVerificationCode', async function () {
      userRepository.findOne.mockResolvedValue({
        email: 'test@test.com',
        password: 'Test123',
        isVerified: false,
      });
      const result = await service.resendVerificationCode('test@test.com');
      expect(result).toMatchObject({ ok: true, error: null });
    });
    it('should fail user not exist', async function () {
      userRepository.findOne.mockResolvedValue(undefined);
      const result = await service.resendVerificationCode('test@test.com');
      expect(result).toMatchObject({
        ok: false,
        error: 'Please insert exist email address',
      });
    });
    it('should fail user is verified', async function () {
      userRepository.findOne.mockResolvedValue({
        email: 'test@test.com',
        password: 'Test123',
        isVerified: true,
      });
      const result = await service.resendVerificationCode('test@test.com');
      expect(result).toMatchObject({
        ok: false,
        error: 'Your account is already verified',
      });
    });
  });
  describe('sendResetPasswordLink', function () {
    it('should sendResetPasswordLink', async function () {
      userRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: 'Test123',
        resetPasswordAttempts: 0,
      });
      const result = await service.sendResetPasswordLink('test@test.com');
      expect(result).toMatchObject({ ok: true, error: null });
    });
    it('should fail user not exist', async function () {
      userRepository.findOne.mockResolvedValue(undefined);
      const result = await service.sendResetPasswordLink('test@test.com');
      expect(result).toMatchObject({
        ok: false,
        error: 'Please insert exist email address',
      });
    });
    it('should fail user reached maximum reset password attempt', async function () {
      userRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: 'Test123',
        resetPasswordAttempts: 3,
      });
      const result = await service.sendResetPasswordLink('test@test.com');
      expect(result).toMatchObject({
        ok: false,
        error: 'You have reached maximum reset password attempts',
      });
    });
  });
  describe('resetPassword', function () {
    it('should reset password', async function () {
      const password = await bcrypt.hash('Test123', 10);
      const token = mockJwtService.signAsync();
      userRepository.findOneBy.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        resetPasswordAttempts: 0,
        password,
      });
      const result = await service.resetPassword({
        token,
        password,
        confirmPassword: password,
      });
      expect(result).toMatchObject({ ok: true, error: null });
    });
    it('should reset password', async function () {
      const password = await bcrypt.hash('Test123', 10);
      const token = mockJwtService.signAsync();
      userRepository.findOneBy.mockResolvedValue(null);
      const result = await service.resetPassword({
        token,
        password,
        confirmPassword: password,
      });
      expect(result).toMatchObject({ ok: false, error: 'user not found' });
    });
  });
  describe('changePassword', function () {
    it('should change password successfully', async function () {
      const user = new UserEntity();
      user.password = await bcrypt.hash('Test123', 10);
      user.resetPasswordAttempts = 0;
      const result = await service.changePassword(user, 'Test1234');
      expect(result).toMatchObject({ ok: true, error: null });
    });
    it('should fail reached maximum reset password attempt', async function () {
      const user = new UserEntity();
      user.password = await bcrypt.hash('Test123', 10);
      user.resetPasswordAttempts = 3;
      const result = await service.changePassword(user, 'Test1234');
      expect(result).toMatchObject({
        ok: false,
        error: 'You have reached maximum reset password attempts',
      });
    });
    it('should fail Repetitious password', async function () {
      const user = new UserEntity();
      user.password = await bcrypt.hash('Test123', 10);
      user.resetPasswordAttempts = 0;
      const result = await service.changePassword(user, 'Test123');
      expect(result).toMatchObject({
        ok: false,
        error: 'You cannot use your old password again',
      });
    });
  });
});
