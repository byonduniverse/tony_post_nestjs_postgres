import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  username: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 10, enum: ['admin', 'user'], default: 'user' })
  role: string;

  @Column({
    length: 20,
    enum: ['approved', 'disapproved'],
    default: 'disapproved',
  })
  status: string;
}
