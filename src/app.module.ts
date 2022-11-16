import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";

import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {UsersModule} from './users/users.module';
import {CommonModule} from './common/common.module';
import {UserEntity} from "./users/entities/user.entity";
import {JwtMiddleware} from "./middlewares/jwt/jwt.middleware";
import {JwtService} from "@nestjs/jwt";
import { MailModule } from './mail/mail.module';
import {HttpModule, HttpService} from '@nestjs/axios';
import {MailService} from "./mail/mail.service";

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
            context: ({req}) => ({user: req["user"]}),
            cors: {
                credentials: true,
                origin: true
            }
        }),
        TypeOrmModule.forRoot({
            type: "postgres",
            url: process.env.POSTGRES_URL,
            synchronize: process.env.NODE_ENV !== "prod",
            entities: [UserEntity],
        }),
        MailModule,
        UsersModule,
        CommonModule,

    ],
    providers: [JwtService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(JwtMiddleware).forRoutes({path: "/graphql", method: RequestMethod.ALL})
    }
}
