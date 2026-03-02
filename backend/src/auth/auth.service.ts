/**
 * Servicio de Autenticación.
 * Gestiona la lógica de inicio/cierre de sesión, generación de tokens y refresco.
 */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import { UserService } from '../user/user.service';
import { LoginDto, LoginResponseDto } from './auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly SECRET = process.env.JWT_SECRET;
  private readonly REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  /**
   * Procesa la solicitud de inicio de sesión.
   * Valida credenciales, verifica que el usuario esté activo y genera tokens.
   */
  async login(loginDto: LoginDto, response: Response): Promise<LoginResponseDto> {
    const { username, password } = loginDto;

    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new HttpException('Invalid username or password', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid username or password', HttpStatus.UNAUTHORIZED);
    }

    if (!user.isActive) {
      throw new HttpException('Account is disabled', HttpStatus.FORBIDDEN);
    }

    const { id, firstName, lastName, role } = user;

    const accessToken = await this.jwtService.signAsync(
      { username, firstName, lastName, role },
      { subject: id, expiresIn: '15m', secret: this.SECRET },
    );

    /* Genera un token de refresco y lo almacena en una cookie httponly */
    const refreshToken = await this.jwtService.signAsync(
      { username, firstName, lastName, role },
      { subject: id, expiresIn: '1y', secret: this.REFRESH_SECRET },
    );

    await this.userService.setRefreshToken(id, refreshToken);

    response.cookie('refresh-token', refreshToken, { httpOnly: true });

    return { token: accessToken, user };
  }

  /**
   * Dado que JWT es apátrida, esta función elimina el token de refresco de las cookies y la BD.
   */
  async logout(request: Request, response: Response): Promise<boolean> {
    const userId = request.user['userId'];
    await this.userService.setRefreshToken(userId, null);
    response.clearCookie('refresh-token');
    return true;
  }

  /**
   * Refresca el token de acceso mediante el token de refresco proporcionado.
   */
  async refresh(refreshToken: string, response: Response): Promise<LoginResponseDto> {
    if (!refreshToken) {
      throw new HttpException('Refresh token required', HttpStatus.BAD_REQUEST);
    }

    const decoded = this.jwtService.decode(refreshToken);
    const user = await this.userService.findById(decoded['sub']);

    if (!user.isActive) {
      response.clearCookie('refresh-token');
      await this.userService.setRefreshToken(user.id, null);
      throw new HttpException('Account is disabled', HttpStatus.FORBIDDEN);
    }

    const { firstName, lastName, username, id, role } = user;

    if (!(await bcrypt.compare(refreshToken, user.refreshToken))) {
      response.clearCookie('refresh-token');
      throw new HttpException('Refresh token is not valid', HttpStatus.FORBIDDEN);
    }

    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.REFRESH_SECRET,
      });
      const accessToken = await this.jwtService.signAsync(
        { username, firstName, lastName, role },
        { subject: id, expiresIn: '15m', secret: this.SECRET },
      );

      return { token: accessToken, user };
    } catch (error) {
      response.clearCookie('refresh-token');
      await this.userService.setRefreshToken(id, null);
      throw new HttpException('Refresh token is not valid', HttpStatus.FORBIDDEN);
    }
  }
}
