/**
 * Entidad que representa la calificación (voto) de un usuario para un curso.
 */
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Course } from '../course/course.entity';
import { User } from '../user/user.entity';

@Entity()
export class Vote extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.votes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Course, (course) => course.votes, { onDelete: 'CASCADE' })
  course: Course;

  @Column({ type: 'int' })
  rating: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  votedAt: Date;
}
