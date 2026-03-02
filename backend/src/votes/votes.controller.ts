/**
 * Controlador de Votaciones.
 * Permite a los usuarios calificar los cursos con una puntuación.
 */
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from '../decorators/user.decorator';
import { VotesService } from './votes.service';

class VoteDto {
  @ApiProperty({ example: 5, description: 'Rating from 1 to 5' })
  rating: number;
}

@Controller('votes')
@ApiTags('Votes')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
export class VotesController {
  constructor(private readonly service: VotesService) {}

  @Post('/:courseId')
  async vote(
    @Param('courseId') courseId: string,
    @User('userId') userId: string,
    @Body() voteDto: VoteDto,
  ) {
    return this.service.vote(userId, courseId, voteDto.rating);
  }

  @Get('/:courseId')
  async list(@Param('courseId') courseId: string) {
    return this.service.listForCourse(courseId);
  }

  @Get('/:courseId/average')
  async average(@Param('courseId') courseId: string) {
    return this.service.averageRating(courseId);
  }
}
