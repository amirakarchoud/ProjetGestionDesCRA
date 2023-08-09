import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //console.log('canActivite')
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles?.length) {
      return true;
    }
    console.log(roles.length);

    console.log('context= ' + context.switchToHttp().toString());
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('user= ' + (user as Collab));

    const hasAppropriateRole = roles.includes((user as Collab).role);
    if (!hasAppropriateRole) {
      throw new UnauthorizedException(`
        it appears that you don't have permission to access this content. 
        `);
    }
    return true;
  }
}
