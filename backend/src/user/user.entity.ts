import { Exclude } from 'class-transformer';
import { Factory } from 'nestjs-seeder';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Enrollment } from '../enrollments/enrollment.entity';
import { Role } from '../enums/role.enum';
import { Favorite } from '../favorites/favorite.entity';
import { Vote } from '../votes/vote.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Factory((faker) => faker.person.firstName())
  @Column()
  firstName: string;

  @Factory((faker) => faker.person.lastName())
  @Column()
  lastName: string;

  @Factory((faker) => faker.internet.userName())
  @Column()
  username: string;

  @Factory('password123')
  @Column()
  @Exclude()
  password: string;

  @Factory(Role.User)
  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @OneToMany(() => Favorite, (fav) => fav.user)
  favorites: Favorite[];

  @OneToMany(() => Enrollment, (en) => en.user)
  enrollments: Enrollment[];

  @OneToMany(() => Vote, (v) => v.user)
  votes: Vote[];

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @Factory(true)
  @Column({ default: true })
  isActive: boolean;
}
