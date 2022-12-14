import {
  CallHandler,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../../users/users.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthorizeUserInterceptor implements NestInterceptor {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext.token;
    if (!token) return next.handle();
    const decoded = await this.userService.decodeToken(
      token && token.toString(),
    );
    gqlContext['user'] = await this.userService
      .findUserByEmail(decoded.toString())
      .catch((err) => {
        console.log(err.message);
      });
    return next.handle();
  }
}
