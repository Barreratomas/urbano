import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Favorite } from './favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favRepo: Repository<Favorite>,
  ) {}

  async toggle(userId: string, courseId: string): Promise<Favorite> {
    try {
      const existing = await this.favRepo.findOne({
        where: { user: { id: userId }, course: { id: courseId } },
      });
      if (existing) {
        await this.favRepo.delete(existing.id);
        return null;
      }
      const fav = this.favRepo.create({
        user: { id: userId } as any,
        course: { id: courseId } as any,
      });
      return await this.favRepo.save(fav);
    } catch (error) {
      throw new HttpException('Error toggling favorite', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listByUser(userId: string): Promise<Favorite[]> {
    try {
      return await this.favRepo.find({ where: { user: { id: userId } }, relations: ['course'] });
    } catch (error) {
      throw new HttpException('Error fetching user favorites', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
