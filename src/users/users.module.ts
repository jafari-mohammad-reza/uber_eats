import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { readFileSync } from 'fs';
import { join } from 'path';
import { MailService } from '../mail/mail.service';

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
  providers: [UsersService, UsersResolver, MailService],
  exports: [UsersService],
})
export class UsersModule {}
