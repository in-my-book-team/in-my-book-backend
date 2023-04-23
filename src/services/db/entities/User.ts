import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false, type: 'varchar' })
  nickname!: string;

  @Column({ nullable: false, type: 'varchar' })
  email!: string;

  @Column({ nullable: false, type: 'varchar' })
  password!: string;

  @Column({ nullable: false, default: false, type: 'boolean' })
  isActivated!: boolean;

  @Column({ type: 'varchar' })
  activationLink!: string;
}

export default User;
