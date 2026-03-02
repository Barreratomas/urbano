import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO para la solicitud de contacto.
 */
export class ContactDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'usuario@ejemplo.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Asunto del mensaje' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: 'Este es el cuerpo del mensaje' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
