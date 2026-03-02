/**
 * DTO para la respuesta de estadísticas globales.
 */
import { ApiProperty } from '@nestjs/swagger';

export class StatsResponseDto {
  @ApiProperty()
  numberOfUsers: number;

  @ApiProperty()
  numberOfCourses: number;

  @ApiProperty()
  numberOfContents: number;
}
