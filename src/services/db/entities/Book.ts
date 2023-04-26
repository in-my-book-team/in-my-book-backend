import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { Rate } from './Rate';

@Entity()
export class Book {
  @Column()
  id!: number; // "works" key

  @Column({ nullable: true, type: 'boolean' })
  isFavorite!: boolean;

  @OneToMany(() => Rate, (rate) => rate.id, { cascade: true })
  @JoinColumn()
  rates!: Rate[];
}
