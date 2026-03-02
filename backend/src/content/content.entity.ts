/**
 * Entidad que representa el contenido de un curso en la base de datos.
 */
import { Factory } from 'nestjs-seeder';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Course } from '../course/course.entity';

@Entity()
export class Content extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Factory((faker) => faker.lorem.words(3))
  @Column()
  name: string;

  @Factory((faker) => faker.lorem.sentence())
  @Column()
  description: string;

  @Factory((faker) => faker.date.past())
  @Column()
  dateCreated: Date;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ select: false, nullable: false })
  courseId: string;

  @ManyToOne(() => Course, (course) => course.contents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;
}
