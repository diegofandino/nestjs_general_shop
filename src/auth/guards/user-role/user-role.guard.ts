import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const req = context.switchToHttp().getRequest();
    const validRoles = this.reflector.get('roles', context.getHandler());


    const user = req.user;

    for (const role of user.roles) {

      if (validRoles.includes(role)) {
        return true;
      }

    };

    throw new ForbiddenException(`User ${user.fullName} need a valid role: ${validRoles}`)


  }
}
