import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, nullable: false })
  title: string;

  @Column({ length: 1000, nullable: false })
  content: string;

  @ManyToOne(() => User, (user: User) => user.posts, { nullable: false })
  user: User;
}
