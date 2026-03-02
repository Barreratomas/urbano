/**
 * Servicio de Usuarios.
 * Contiene la lógica de negocio para la gestión de usuarios, incluyendo el cifrado de contraseñas.
 */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ILike, Repository } from 'typeorm';

import {
  EntityNotFoundException,
  UserAlreadyExistsException,
} from '../common/exceptions/business-logic.exception';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.entity';
import { UserQuery } from './user.query';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Crea un nuevo usuario tras validar que no exista previamente.
   */
  async save(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.findByUsername(createUserDto.username);

      if (user) {
        throw new UserAlreadyExistsException(createUserDto.username);
      }

      const { password } = createUserDto;
      createUserDto.password = await bcrypt.hash(password, 10);
      return await this.userRepository.save(Object.assign(new User(), createUserDto));
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) throw error;
      throw new HttpException('Error creating user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Busca usuarios según los filtros proporcionados.
   */
  async findAll(userQuery: UserQuery): Promise<User[]> {
    try {
      const { limit, offset, sortBy, sortOrder, role, firstName, lastName, username } = userQuery;
      const where = {};

      if (firstName) where['firstName'] = ILike(`%${firstName}%`);
      if (lastName) where['lastName'] = ILike(`%${lastName}%`);
      if (username) where['username'] = ILike(`%${username}%`);
      if (role) where['role'] = role;

      const order = {};
      if (sortBy) {
        order[sortBy] = sortOrder || 'ASC';
      } else {
        order['firstName'] = 'ASC';
      }

      return await this.userRepository.find({
        where,
        take: limit,
        skip: offset,
        order,
      });
    } catch (error) {
      throw new HttpException('Error fetching users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Obtiene un usuario por su ID único.
   */
  async findById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne(id);

      if (!user) {
        throw new EntityNotFoundException('User', id);
      }

      return user;
    } catch (error) {
      if (error instanceof EntityNotFoundException) throw error;
      throw new HttpException('Error finding user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Busca un usuario por su nombre de usuario.
   */
  async findByUsername(username: string): Promise<User> {
    try {
      return await this.userRepository.findOne({ where: { username } });
    } catch (error) {
      throw new HttpException('Error finding user by username', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Actualiza los datos de un usuario existente.
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const currentUser = await this.findById(id);

      /* Si el nombre de usuario es el mismo, lo eliminamos del DTO */
      if (currentUser.username === updateUserDto.username) {
        delete updateUserDto.username;
      }

      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      if (updateUserDto.username) {
        if (await this.findByUsername(updateUserDto.username)) {
          throw new UserAlreadyExistsException(updateUserDto.username);
        }
      }

      await this.userRepository.update(id, updateUserDto);
      return await this.findById(id);
    } catch (error) {
      if (error instanceof EntityNotFoundException || error instanceof UserAlreadyExistsException)
        throw error;
      throw new HttpException('Error updating user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Elimina un usuario del sistema por su ID.
   */
  async delete(id: string): Promise<string> {
    try {
      await this.findById(id);
      await this.userRepository.delete(id);
      return id;
    } catch (error) {
      if (error instanceof EntityNotFoundException) throw error;
      throw new HttpException('Error deleting user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Cuenta el total de usuarios en el sistema.
   */
  async count(): Promise<number> {
    return await this.userRepository.count();
  }

  /**
   * Cifra el token de refresco y lo guarda en la base de datos.
   */
  async setRefreshToken(id: string, refreshToken: string): Promise<void> {
    await this.userRepository.update(id, {
      refreshToken: refreshToken ? await bcrypt.hash(refreshToken, 10) : null,
    });
  }
}
