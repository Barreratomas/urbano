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

  // when a file is uploaded by multer, controller will set this value
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
