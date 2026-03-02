/**
 * Servicio de Contenidos.
 * Gestiona la lógica de negocio para las lecciones o materiales asociados a los cursos.
 */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { EntityNotFoundException } from '../common/exceptions/business-logic.exception';
import { CourseService } from '../course/course.service';
import { CreateContentDto, UpdateContentDto } from './content.dto';
import { Content } from './content.entity';
import { ContentQuery } from './content.query';

@Injectable()
export class ContentService {
  constructor(
    private readonly courseService: CourseService,
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}

  /**
   * Guarda un nuevo contenido asociado a un curso.
   */
  async save(courseId: string, createContentDto: CreateContentDto): Promise<Content> {
    try {
      const { name, description, imageUrl } = createContentDto;
      const course = await this.courseService.findById(courseId);
      const content = Object.assign(new Content(), {
        name,
        description,
        course,
        dateCreated: new Date(),
        imageUrl,
      });
      return await this.contentRepository.save(content);
    } catch (error) {
      if (error instanceof EntityNotFoundException) throw error;
      throw new HttpException('Error saving content', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Busca todos los contenidos aplicando filtros.
   */
  async findAll(contentQuery: ContentQuery): Promise<Content[]> {
    try {
      const { limit, offset, sortBy, sortOrder, name, description } = contentQuery;
      const where = {};

      if (name) where['name'] = ILike(`%${name}%`);
      if (description) where['description'] = ILike(`%${description}%`);

      const order = {};
      if (sortBy) {
        order[sortBy] = sortOrder || 'ASC';
      } else {
        order['name'] = 'ASC';
      }

      return await this.contentRepository.find({
        where,
        take: limit,
        skip: offset,
        order,
      });
    } catch (error) {
      throw new HttpException('Error fetching contents', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Obtiene un contenido específico por su ID.
   */
  async findById(id: string): Promise<Content> {
    try {
      const content = await this.contentRepository.findOne(id);

      if (!content) {
        throw new EntityNotFoundException('Content', id);
      }

      return content;
    } catch (error) {
      if (error instanceof EntityNotFoundException) throw error;
      throw new HttpException('Error finding content', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Busca un contenido específico validando su pertenencia a un curso.
   */
  async findByCourseIdAndId(courseId: string, id: string): Promise<Content> {
    try {
      const content = await this.contentRepository.findOne({
        where: { id, course: { id: courseId } },
      });
      if (!content) {
        throw new EntityNotFoundException('Content', id);
      }
      return content;
    } catch (error) {
      if (error instanceof EntityNotFoundException) throw error;
      throw new HttpException('Error finding content by course', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Obtiene todos los contenidos de un curso específico.
   */
  async findAllByCourseId(courseId: string, contentQuery: ContentQuery): Promise<Content[]> {
    try {
      const { limit, offset, sortBy, sortOrder, name, description } = contentQuery;
      const where = { course: { id: courseId } };

      if (name) where['name'] = ILike(`%${name}%`);
      if (description) where['description'] = ILike(`%${description}%`);

      const order = {};
      if (sortBy) {
        order[sortBy] = sortOrder || 'ASC';
      } else {
        order['name'] = 'ASC';
      }

      return await this.contentRepository.find({
        where: where as any,
        take: limit,
        skip: offset,
        order,
      });
    } catch (error) {
      throw new HttpException('Error fetching course contents', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Actualiza la información de un contenido existente.
   */
  async update(courseId: string, id: string, updateContentDto: UpdateContentDto): Promise<Content> {
    try {
      await this.findByCourseIdAndId(courseId, id);
      await this.contentRepository.update(id, updateContentDto);
      return await this.findById(id);
    } catch (error) {
      if (error instanceof EntityNotFoundException) throw error;
      throw new HttpException('Error updating content', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Elimina un contenido del sistema.
   */
  async delete(courseId: string, id: string): Promise<string> {
    try {
      await this.findByCourseIdAndId(courseId, id);
      await this.contentRepository.delete(id);
      return id;
    } catch (error) {
      if (error instanceof EntityNotFoundException) throw error;
      throw new HttpException('Error deleting content', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Cuenta el total de contenidos registrados.
   */
  async count(): Promise<number> {
    try {
      return await this.contentRepository.count();
    } catch (error) {
      throw new HttpException('Error counting contents', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
