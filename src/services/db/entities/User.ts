import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Token } from './Token';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, type: 'varchar' })
  nickname!: string;

  @Column({ nullable: false, type: 'varchar' })
  email!: string;

  @Column({ nullable: false, type: 'varchar' })
  password!: string;

  @Column({ nullable: false, type: 'varchar', default: false })
  isActivated!: boolean;

  @Column({ type: 'varchar' })
  activationLink!: string;

  @OneToOne(() => Token, (token) => token.user)
  token!: Token;
}
