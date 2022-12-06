import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { AllowedRoles } from '../../decorators/role/roles.decorator';
import { UserEntity, UserRoles } from '../../users/entities/user.entity';

@Injectable()
export class RightRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles: AllowedRoles[] = this.reflector.get<AllowedRoles[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) return true;
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user: UserEntity = gqlContext['user'];
    if (!user) return false;
    if (user.role === UserRoles.Admin) return true;
    const hasRole = () => roles.indexOf(user.role) > -1;
    let hasPermission: boolean = false;
    if (hasRole()) {
      hasPermission = true;
    }
    return user && hasPermission;
  }
}
