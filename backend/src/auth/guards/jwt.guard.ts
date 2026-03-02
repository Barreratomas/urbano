/**
 * Guard para proteger rutas mediante JWT.
 * Utiliza la estrategia 'jwt' de Passport para validar el token en la cabecera.
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}
