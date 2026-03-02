/**
 * Seeder de Usuarios.
 * Crea usuarios de prueba con diferentes roles y contraseñas cifradas.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';

import { Role } from '../enums/role.enum';
import { User } from '../user/user.entity';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Ejecuta el sembrado de usuarios.
   */
  async seed(): Promise<any> {
    // 1. Crear usuarios fijos de prueba para cada rol
    const passwords = await Promise.all([
      bcrypt.hash('admin123', 10),
      bcrypt.hash('editor123', 10),
      bcrypt.hash('user123', 10),
    ]);

    const staticUsers: Partial<User>[] = [
      {
        firstName: 'Admin',
        lastName: 'Urbano',
        username: 'admin',
        password: passwords[0],
        role: Role.Admin,
        isActive: true,
      },
      {
        firstName: 'Editor',
        lastName: 'Urbano',
        username: 'editor',
        password: passwords[1],
        role: Role.Editor,
        isActive: true,
      },
      {
        firstName: 'User',
        lastName: 'Urbano',
        username: 'user',
        password: passwords[2],
        role: Role.User,
        isActive: true,
      },
    ];

    // Guardar usuarios fijos
    await this.userRepository.save(staticUsers);

    // 2. Generar usuarios aleatorios adicionales (mezcla de roles)
    const randomUsers = DataFactory.createForClass(User).generate(10);

    for (const user of randomUsers) {
      user.password = await bcrypt.hash(user.password, 10);
      // Algunos usuarios aleatorios también pueden ser editores o admins
      const roll = Math.random();
      if (roll > 0.8) {
        user.role = Role.Admin;
      } else if (roll > 0.5) {
        user.role = Role.Editor;
      }
    }

    // Guardar el resto de los usuarios
    return this.userRepository.save(randomUsers);
  }

  /**
   * Elimina todos los usuarios generados por este seeder.
   */
  async drop(): Promise<any> {
    return this.userRepository.delete({});
  }
}
