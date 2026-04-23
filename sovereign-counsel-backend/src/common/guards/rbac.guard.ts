import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user as { roleName?: string; permissions?: string[] } | undefined;

    if (!user) {
      throw new ForbiddenException('User context is required');
    }

    if (requiredRoles?.length && !requiredRoles.includes(user.roleName ?? '')) {
      throw new ForbiddenException('Insufficient role');
    }

    if (requiredPermissions?.length) {
      const userPermissions = new Set(user.permissions ?? []);
      const hasAll = requiredPermissions.every((permission) => userPermissions.has(permission));
      if (!hasAll) {
        throw new ForbiddenException('Insufficient permissions');
      }
    }

    return true;
  }
}
