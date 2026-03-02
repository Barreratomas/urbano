/**
 * Controlador de Favoritos.
 * Gestiona la lista de cursos favoritos de los usuarios.
 */
import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from '../decorators/user.decorator';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
@ApiTags('Favorites')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
export class FavoritesController {
  constructor(private readonly favService: FavoritesService) {}

  @Post('/:courseId/toggle')
  async toggle(@Param('courseId') courseId: string, @User('userId') userId: string) {
    return this.favService.toggle(userId, courseId);
  }

  @Get('user/:userId')
  async listByUser(@Param('userId') userId: string) {
    return this.favService.listByUser(userId);
  }
}
