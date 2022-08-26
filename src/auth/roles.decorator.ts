import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/roles';

export const ROLES_KEY = 'allowRoles';
export const AllowedRoles = (...roles: Roles[]) =>
  SetMetadata(ROLES_KEY, roles);
