import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Vote } from './vote.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private readonly repo: Repository<Vote>,
  ) {}

  async vote(userId: string, courseId: string, rating: number): Promise<Vote> {
    try {
      const existing = await this.repo.findOne({
        where: { user: { id: userId }, course: { id: courseId } },
      });
      if (existing) {
        existing.rating = rating;
        return await this.repo.save(existing);
      }
      const v = this.repo.create({
        user: { id: userId } as any,
        course: { id: courseId } as any,
        rating,
      });
      return await this.repo.save(v);
    } catch (error) {
      throw new HttpException('Error processing vote', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listForCourse(courseId: string): Promise<Vote[]> {
    try {
      return await this.repo.find({ where: { course: { id: courseId } } });
    } catch (error) {
      throw new HttpException('Error fetching votes for course', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async averageRating(courseId: string): Promise<number> {
    try {
      const result = await this.repo
        .createQueryBuilder('vote')
        .select('AVG(vote.rating)', 'avg')
        .where('vote.courseId = :courseId', { courseId })
        .getRawOne();
      return parseFloat(result.avg) || 0;
    } catch (error) {
      throw new HttpException('Error calculating average rating', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
