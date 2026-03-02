/**
 * Estrategia de autenticación JWT para Passport.
 * Valida el token Bearer de las peticiones y extrae la información del usuario.
 */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * Valida el payload del token y verifica que el usuario siga activo.
   */
  async validate(payload: any) {
    const user = await this.userService.findById(payload.sub);

    if (!user.isActive) {
      throw new HttpException('Account is disabled', HttpStatus.FORBIDDEN);
    }

    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
