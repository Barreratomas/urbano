/**
 * Entidad que representa a un curso en la base de datos.
 */
import { Factory } from 'nestjs-seeder';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Content } from '../content/content.entity';
import { Enrollment } from '../enrollments/enrollment.entity';
import { Favorite } from '../favorites/favorite.entity';
import { Vote } from '../votes/vote.entity';

@Entity()
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Factory((faker) => faker.commerce.productName())
  @Column()
  name: string;

  @Factory((faker) => faker.commerce.productDescription())
  @Column()
  description: string;

  @Factory((faker) => faker.date.past())
  @Column()
  dateCreated: Date;

  @Factory((faker) => faker.date.recent())
  @Column({ nullable: true })
  startDate?: Date;

  @Factory((faker) => faker.date.soon())
  @Column({ nullable: true })
  endDate?: Date;

  @Factory((faker) => faker.helpers.arrayElement(['es', 'en']))
  @Column({ default: 'es' })
  language: string;

  @OneToMany(() => Content, (content) => content.course)
  contents: Content[];

  @OneToMany(() => Favorite, (fav) => fav.course)
  favorites: Favorite[];

  @OneToMany(() => Enrollment, (en) => en.course)
  enrollments: Enrollment[];

  @OneToMany(() => Vote, (v) => v.course)
  votes: Vote[];
}
