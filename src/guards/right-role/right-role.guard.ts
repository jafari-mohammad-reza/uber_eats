import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { AllowedRoles } from '../../decorators/role/roles.decorator';
import { UserRoles } from '../../users/user.entity';
import { UsersService } from '../../users/users.service';

@Injectable()
export class RightRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles: AllowedRoles[] = this.reflector.get<AllowedRoles[]>(
      'roles',
      context.getHandler(),
    );

    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext.token;
    if (!token) return false;
    return this.userService
      .decodeToken(token.toString())
      .then(async (decoded) => {
        const user = await this.userService
          .findUserByEmail(decoded.toString())
          .catch((err) => {
            throw new InternalServerErrorException(err);
          });
        if (!roles || roles[0] === 'Any') return true;
        if (!user) return false;
        if (user.role === UserRoles.Admin) return true;
        const hasRole = () => roles.indexOf(user.role) > -1;
        let hasPermission: boolean = false;
        if (hasRole()) {
          hasPermission = true;
        }
        return user && hasPermission;
      })
      .catch(() => {
        return false;
      });
  }
}
