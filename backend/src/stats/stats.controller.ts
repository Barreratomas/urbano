/**
 * Controlador de Estadísticas.
 * Proporciona información consolidada sobre el estado del sistema.
 */
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { StatsResponseDto } from './stats.dto';
import { StatsService } from './stats.service';

@Controller('stats')
@ApiTags('Stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  /**
   * Obtiene las estadísticas globales (conteo de usuarios, cursos y contenidos).
   */
  @Get()
  async getStats(): Promise<StatsResponseDto> {
    return await this.statsService.getStats();
  }
}
