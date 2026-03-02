/**
 * DTOs para la gestión de contenidos de lecciones.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContentDto {
  @ApiProperty({ example: 'Introduction to Services' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Deep dive into NestJS services and providers' })
  @IsNotEmpty()
  @IsString()
  description: string;

  /* El controlador establecerá este valor cuando se cargue un archivo mediante multer */
  @ApiPropertyOptional({ example: '/uploads/content.png' })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class UpdateContentDto {
  @ApiPropertyOptional({ example: 'Updated Content Name' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '/uploads/updated.png' })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
