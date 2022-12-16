import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { readFileSync } from 'fs';
import { join } from 'path';
import { MailService } from '../mail/mail.service';
import { RightRoleGuard } from '../guards/right-role/right-role.guard';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import {ThrottlerModule, ThrottlerStorage, ThrottlerStorageService} from "@nestjs/throttler";
import {ThrottlerStorageProvider} from "@nestjs/throttler/dist/throttler.providers";
import {Reflector} from "@nestjs/core";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      privateKey: readFileSync(join(__dirname, '..', '..', 'jwtRS256.key'), {
        encoding: 'utf-8',
      }),
      publicKey: readFileSync(join(__dirname, '..', '..', 'jwtRS256.key.pub'), {
        encoding: 'utf-8',
      }),
      signOptions: { algorithm: 'RS256' },
      verifyOptions: { algorithms: ['RS256'] },
    }),
  ],
  providers: [
    UsersService,
    UsersResolver,
    MailService,
    { provide: GUARDS_METADATA, useClass: RightRoleGuard },
  ],
  exports: [UsersService],
})
export class UsersModule {}
