import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { JwtMiddleware } from './middlewares/jwt/jwt.middleware';
import { JwtService } from '@nestjs/jwt';
import { MailModule } from './mail/mail.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UserEntity } from './users/entities/user.entity';
import { CategoryModule } from './category/category.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { UploadsModule } from './uploads/uploads.module';
import { RestaurantEntity } from './restaurant/restaurant.entity';
import { CategoryEntity } from './category/category.entity';
import { MenueItemModule } from './menue-item/menue-item.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      playground: true,
      context: ({ req }) => ({ user: req['user'] }),
      cors: {
        credentials: true,
        origin: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: process.env.POSTGRES_DB_HOST,
        port: Number(configService.get('POSTGRES_DB_PORT')),
        database: configService.get('POSTGRES_DB_NAME'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        synchronize: configService.get('NODE_ENV') !== 'prod',
        entities: [UserEntity, CategoryEntity, RestaurantEntity],
      }),
    }),
    MailModule,
    UsersModule,
    CommonModule,
    CloudinaryModule,
    CategoryModule,
    RestaurantModule,
    UploadsModule,
    MenueItemModule,
  ],
  providers: [JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: '/graphql', method: RequestMethod.ALL });
  }
}
