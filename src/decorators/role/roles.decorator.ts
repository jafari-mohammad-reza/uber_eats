import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../../users/entities/user.entity';

export type AllowedRoles = keyof typeof UserRoles | 'Any';
export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
