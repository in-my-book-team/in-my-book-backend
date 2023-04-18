import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './User';

@Entity()
class TokenDB {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  refreshToken!: string;

  @OneToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn()
  user!: User;
}

export default TokenDB;
