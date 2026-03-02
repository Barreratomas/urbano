/**
 * Controlador de Inscripciones.
 * Permite a los usuarios inscribirse o darse de baja en los cursos.
 */
import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from '../decorators/user.decorator';
import { EnrollmentsService } from './enrollments.service';

@Controller('enrollments')
@ApiTags('Enrollments')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
export class EnrollmentsController {
  constructor(private readonly service: EnrollmentsService) {}

  @Post('/:courseId')
  async enroll(@Param('courseId') courseId: string, @User('userId') userId: string) {
    return this.service.enroll(userId, courseId);
  }

  @Delete('/:courseId')
  async withdraw(@Param('courseId') courseId: string, @User('userId') userId: string) {
    return this.service.withdraw(userId, courseId);
  }

  @Get('user/:userId')
  async listByUser(@Param('userId') userId: string) {
    return this.service.listByUser(userId);
  }
}
