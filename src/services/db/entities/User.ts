import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class UserDB {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, type: 'varchar' })
  nickname!: string;

  @Column({ nullable: false, type: 'varchar' })
  email!: string;

  @Column({ nullable: false, type: 'varchar' })
  password!: string;

  @Column({ nullable: false, default: false })
  isActivated!: boolean;

  @Column({ type: 'varchar' })
  activationLink!: string;
}

export default UserDB;
