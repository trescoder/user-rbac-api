import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/roles';
import { UserRepositoryService } from 'src/shared/repositories/user-repository/user-repository.service';
import { IS_PUBLIC_KEY } from './jwt-strategy/public.decorator';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userRepoService: UserRepositoryService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // if the route is public, we don't need to check for a required role
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // if thr route isn't public we do need to check for a required role
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userEntity = await this.userRepoService.findUserBy({ id: user.id });
    return requiredRoles.some((role) => role === userEntity.role);
  }
}
