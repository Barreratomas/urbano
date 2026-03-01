import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Course } from '../course/course.entity';
import { User } from '../user/user.entity';

@Entity()
export class Favorite extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Course, (course) => course.favorites, {
    onDelete: 'CASCADE',
  })
  course: Course;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  addedAt: Date;
}
