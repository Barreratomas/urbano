/**
 * Controlador para la autenticación de usuarios.
 * Maneja el inicio de sesión, cierre de sesión y el refresco de tokens JWT.
 */
import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { LoginDto, LoginResponseDto } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Inicia sesión de un usuario y establece las cookies necesarias.
   */
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto, response);
  }

  /**
   * Cierra la sesión del usuario invalidando el token de refresco.
   */
  @UseGuards(JwtGuard)
  @Post('/logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<boolean> {
    return await this.authService.logout(request, response);
  }

  /**
   * Refresca el token de acceso utilizando un token de refresco válido desde las cookies.
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const refresh = request.cookies['refresh-token'];

    return await this.authService.refresh(refresh, response);
  }
}
