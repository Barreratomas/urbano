/**
 * Guard para autorizar el acceso de un usuario a sus propios recursos.
 * Permite el acceso si el usuario es administrador o si el ID del recurso coincide con su propio ID.
 */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class UserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const user = request.user;

    /* Devuelve verdadero si el usuario es admin o si su ID coincide con el parámetro de la solicitud */

    if (user.role === 'admin') {
      return true;
    }

    return user.userId === params.id;
  }
}
