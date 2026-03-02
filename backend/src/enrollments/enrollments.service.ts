/**
 * Servicio de Inscripciones.
 * Gestiona el proceso de inscripción y baja de usuarios en los cursos.
 */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Enrollment } from './enrollment.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly repo: Repository<Enrollment>,
  ) {}

  /**
   * Realiza la inscripción de un usuario en un curso.
   */
  async enroll(userId: string, courseId: string): Promise<Enrollment> {
    try {
      const exists = await this.repo.findOne({
        where: { user: { id: userId }, course: { id: courseId } },
      });
      if (exists) {
        throw new HttpException('Already enrolled', HttpStatus.BAD_REQUEST);
      }
      const en = this.repo.create({ user: { id: userId } as any, course: { id: courseId } as any });
      return await this.repo.save(en);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error during enrollment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Da de baja la inscripción de un usuario en un curso.
   */
  async withdraw(userId: string, courseId: string): Promise<void> {
    try {
      await this.repo.delete({ user: { id: userId } as any, course: { id: courseId } as any });
    } catch (error) {
      throw new HttpException('Error during withdrawal', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Lista todas las inscripciones de un usuario.
   */
  async listByUser(userId: string): Promise<Enrollment[]> {
    try {
      return await this.repo.find({ where: { user: { id: userId } }, relations: ['course'] });
    } catch (error) {
      throw new HttpException('Error fetching user enrollments', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
