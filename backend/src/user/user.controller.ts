/**
 * Controlador de Usuarios.
 * Proporciona endpoints para la gestión de usuarios (CRUD) con control de acceso por roles.
 */
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserGuard } from '../auth/guards/user.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.entity';
import { UserQuery } from './user.query';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Crea un nuevo usuario en el sistema.
   * Solo accesible por administradores.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.Admin)
  async save(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.save(createUserDto);
  }

  /**
   * Obtiene una lista paginada y filtrada de usuarios.
   * Solo accesible por administradores.
   */
  @Get()
  @Roles(Role.Admin)
  async findAll(@Query() userQuery: UserQuery): Promise<User[]> {
    return await this.userService.findAll(userQuery);
  }

  /**
   * Obtiene los detalles de un usuario específico por su ID.
   * El usuario debe ser el mismo que realiza la petición o un administrador.
   */
  @Get('/:id')
  @UseGuards(UserGuard)
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findById(id);
  }

  /**
   * Actualiza la información de un usuario existente.
   * El usuario debe ser el mismo que realiza la petición o un administrador.
   */
  @Put('/:id')
  @UseGuards(UserGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userService.update(id, updateUserDto);
  }

  /**
   * Elimina un usuario del sistema por su ID.
   * Solo accesible por administradores.
   */
  @Delete('/:id')
  @Roles(Role.Admin)
  async delete(@Param('id') id: string): Promise<string> {
    return await this.userService.delete(id);
  }
}
