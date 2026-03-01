import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, IsNull, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { EntityNotFoundException } from '../common/exceptions/business-logic.exception';
import { Enrollment } from '../enrollments/enrollment.entity';
import { Favorite } from '../favorites/favorite.entity';
import { Vote } from '../votes/vote.entity';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { CourseQuery } from './course.query';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  async myFavorites(userId: string): Promise<Course[]> {
    try {
      const favorites = await this.favoriteRepository.find({
        where: { user: { id: userId } },
        relations: ['course'],
      });
      return favorites.map((f) => f.course);
    } catch (error) {
      throw new HttpException('Error fetching favorite courses', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async myEnrollments(userId: string): Promise<Course[]> {
    try {
      const enrollments = await this.enrollmentRepository.find({
        where: { user: { id: userId } },
        relations: ['course'],
      });
      return enrollments.map((e) => e.course);
    } catch (error) {
      throw new HttpException('Error fetching enrolled courses', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async save(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      const course = Object.assign(new Course(), {
        ...createCourseDto,
        dateCreated: new Date(),
      });
      return await this.courseRepository.save(course);
    } catch (error) {
      throw new HttpException('Error saving course', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(courseQuery: CourseQuery, userId?: string): Promise<Course[]> {
    try {
      const { limit, offset, sortBy, sortOrder, name, description } = courseQuery;
      const where = {};

      if (name) where['name'] = ILike(`%${name}%`);
      if (description) where['description'] = ILike(`%${description}%`);

      const order = {};
      if (sortBy) {
        order[sortBy] = sortOrder || 'ASC';
      } else {
        order['name'] = 'ASC';
      }

      const courses = await this.courseRepository.find({
        where,
        take: limit,
        skip: offset,
        order,
        relations: userId ? ['enrollments', 'enrollments.user', 'favorites', 'favorites.user'] : [],
      });

      if (userId) {
        courses.forEach((c) => {
          (c as any).isEnrolled = c.enrollments.some((e) => e.user.id === userId);
          (c as any).isFavorite = c.favorites.some((f) => f.user.id === userId);
        });
      }

      return courses;
    } catch (error) {
      throw new HttpException('Error fetching courses', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: string, userId?: string): Promise<Course> {
    try {
      const course = await this.courseRepository.findOne(id, {
        relations: userId ? ['enrollments', 'enrollments.user', 'favorites', 'favorites.user'] : [],
      });
      if (!course) {
        throw new EntityNotFoundException('Course', id);
      }

      if (userId) {
        (course as any).isEnrolled = course.enrollments.some((e) => e.user.id === userId);
        (course as any).isFavorite = course.favorites.some((f) => f.user.id === userId);
      }

      return course;
    } catch (error) {
      if (error instanceof EntityNotFoundException) throw error;
      throw new HttpException('Error finding course', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    try {
      await this.findById(id);
      await this.courseRepository.update(id, updateCourseDto);
      return await this.findById(id);
    } catch (error) {
      if (error instanceof EntityNotFoundException) throw error;
      throw new HttpException('Error updating course', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: string): Promise<string> {
    try {
      await this.findById(id);
      await this.courseRepository.delete(id);
      return id;
    } catch (error) {
      if (error instanceof EntityNotFoundException) throw error;
      throw new HttpException('Error deleting course', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAverageRating(courseId: string): Promise<number> {
    try {
      const votes = await this.voteRepository.find({ where: { course: { id: courseId } } });
      if (!votes.length) return 0;
      const sum = votes.reduce((a, v) => a + v.rating, 0);
      return sum / votes.length;
    } catch (error) {
      throw new HttpException('Error calculating average rating', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async count(): Promise<number> {
    try {
      return await this.courseRepository.count();
    } catch (error) {
      throw new HttpException('Error counting courses', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getCalendarData(
    start: string,
    end: string,
    userId?: string,
  ): Promise<Array<{ date: string; courses: any[] }>> {
    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    // Find courses that overlap with the range
    const courses = await this.courseRepository.find({
      where: [
        {
          startDate: LessThanOrEqual(endDate),
          endDate: MoreThanOrEqual(startDate),
        },
        {
          startDate: Between(startDate, endDate),
          endDate: IsNull(),
        },
      ],
      relations: userId ? ['enrollments', 'enrollments.user'] : [],
    });

    const resultCourses = courses.map((c) => ({
      ...c,
      isEnrolled: userId ? c.enrollments.some((e) => e.user.id === userId) : false,
    }));

    // Group by date - A course can appear in multiple days if it spans a range
    const map = new Map<string, any[]>();

    const toDateKey = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    resultCourses.forEach((c) => {
      const s = new Date(c.startDate);
      const e = c.endDate ? new Date(c.endDate) : new Date(c.startDate);

      // Start of the course or start of the range
      const curr = new Date(Math.max(s.getTime(), startDate.getTime()));
      // End of the course or end of the range
      const last = new Date(Math.min(e.getTime(), endDate.getTime()));

      // Normalization to midnight for comparison
      curr.setHours(0, 0, 0, 0);
      last.setHours(0, 0, 0, 0);

      while (curr <= last) {
        const dateKey = toDateKey(curr);
        const existing = map.get(dateKey) || [];
        map.set(dateKey, [...existing, c]);
        curr.setDate(curr.getDate() + 1);
      }
    });

    return Array.from(map.entries()).map(([date, courses]) => ({
      date,
      courses,
    }));
  }

  async getRanking(): Promise<Course[]> {
    // Basic ranking: return courses sorted by name for now, or implement rating sort if needed
    // Ideally this would join with votes and sort by avg rating
    return await this.courseRepository.find({ order: { name: 'ASC' } });
  }

  async toggleFavorite(userId: string, courseId: string): Promise<void> {
    const existing = await this.favoriteRepository.findOne({
      where: { user: { id: userId }, course: { id: courseId } },
    });
    if (existing) {
      await this.favoriteRepository.delete(existing.id);
    } else {
      const fav = this.favoriteRepository.create({
        user: { id: userId } as any,
        course: { id: courseId } as any,
      });
      await this.favoriteRepository.save(fav);
    }
  }

  async enroll(userId: string, courseId: string): Promise<void> {
    const exists = await this.enrollmentRepository.findOne({
      where: { user: { id: userId }, course: { id: courseId } },
    });
    if (!exists) {
      const en = this.enrollmentRepository.create({
        user: { id: userId } as any,
        course: { id: courseId } as any,
      });
      await this.enrollmentRepository.save(en);
    }
  }

  async withdraw(userId: string, courseId: string): Promise<void> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { user: { id: userId }, course: { id: courseId } },
    });
    if (enrollment) {
      await this.enrollmentRepository.delete(enrollment.id);
    }
  }

  async vote(userId: string, courseId: string, rating: number): Promise<void> {
    const existing = await this.voteRepository.findOne({
      where: { user: { id: userId }, course: { id: courseId } },
    });
    if (existing) {
      existing.rating = rating;
      await this.voteRepository.save(existing);
    } else {
      const v = this.voteRepository.create({
        user: { id: userId } as any,
        course: { id: courseId } as any,
        rating,
      });
      await this.voteRepository.save(v);
    }
  }
}
