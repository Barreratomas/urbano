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

  async findByUsername(username: string): Promise<User> {
    try {
      return await this.userRepository.findOne({ where: { username } });
    } catch (error) {
      throw new HttpException('Error finding user by username', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const currentUser = await this.findById(id);

      /* If username is same as before, delete it from the dto */
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

  async count(): Promise<number> {
    return await this.userRepository.count();
  }

  /* Hash the refresh token and save it to the database */
  async setRefreshToken(id: string, refreshToken: string): Promise<void> {
    await this.userRepository.update(id, {
      refreshToken: refreshToken ? await bcrypt.hash(refreshToken, 10) : null,
    });
  }
}
