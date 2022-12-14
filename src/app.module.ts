import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { JwtService } from '@nestjs/jwt';
import { MailModule } from './mail/mail.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UserEntity } from './users/user.entity';
import { CategoryModule } from './category/category.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { UploadsModule } from './uploads/uploads.module';
import { RestaurantEntity } from './restaurant/restaurant.entity';
import { CategoryEntity } from './category/category.entity';
import { MenuItemModule } from './menu-item/menu-item.module';
import { MenuItemEntity } from './menu-item/menu-item.entity';
import { OrdersModule } from './orders/orders.module';
import { OrderEntity } from './orders/entities/order.entity';
import { OrderItemEntity } from './orders/entities/order-item.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthorizeUserInterceptor } from './interceptors/authorize-user/authorize-user.interceptor';

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
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: (connectionParams) => {
            return { token: connectionParams['x-jwt'] };
          },
        },
      },
      cors: {
        credentials: true,
        origin: true,
      },
      context: ({ req }) => {
        return {
          token: req.headers['x-jwt'],
          user: req.headers['user'],
        };
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
        entities: [
          UserEntity,
          CategoryEntity,
          RestaurantEntity,
          MenuItemEntity,
          OrderEntity,
          OrderItemEntity,
        ],
      }),
    }),
    MailModule,
    UsersModule,
    CommonModule,
    CloudinaryModule,
    CategoryModule,
    RestaurantModule,
    UploadsModule,
    MenuItemModule,
    OrdersModule,
  ],
  providers: [
    JwtService,
    { provide: APP_INTERCEPTOR, useClass: AuthorizeUserInterceptor },
  ],
  exports: [UsersModule],
})
export class AppModule {}
