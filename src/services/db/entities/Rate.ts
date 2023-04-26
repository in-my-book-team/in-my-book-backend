import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Rate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, type: 'smallint', default: 0 })
  value!: number;

  @ManyToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn()
  user!: User;
}
