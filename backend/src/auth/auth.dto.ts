import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { User } from '../user/user.entity';

export class LoginDto {
  @ApiProperty({ example: 'admin' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'admin123' })
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty({ type: () => User })
  user: User;
}
