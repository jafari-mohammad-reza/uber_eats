import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { UserEntity } from './users/entities/user.entity';
import { JwtMiddleware } from './middlewares/jwt/jwt.middleware';
import { JwtService } from '@nestjs/jwt';
import { MailModule } from './mail/mail.module';
import { CategoryModule } from './category/category.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CategoryEntity } from './category/category.entity';
import { RestaurantModule } from './restaurant/restaurant.module';
import { RestaurantEntity } from './restaurant/entities/restaurant.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      sortSchema: true,
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      playground: true,
      context: ({ req }) => ({ user: req['user'] }),
      cors: {
        credentials: true,
        origin: true,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_DB_HOST,
      port: Number(process.env.POSTGRES_DB_PORT),
      database: process.env.POSTGRES_DB_NAME,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      synchronize: process.env.NODE_ENV !== 'prod',
      entities: [UserEntity, CategoryEntity, RestaurantEntity],
    }),
    MailModule,
    UsersModule,
    CommonModule,
    RestaurantModule,
    CategoryModule,
    CloudinaryModule,
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
