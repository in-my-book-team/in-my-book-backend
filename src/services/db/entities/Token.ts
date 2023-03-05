import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  refreshToken!: string;

  @OneToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn()
  user!: User;
}
