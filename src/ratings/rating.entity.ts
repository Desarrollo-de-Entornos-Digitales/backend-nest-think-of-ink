import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Check,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
@Check(`"score" >= 1 AND "score" <= 5`)
export class Rating {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @ManyToOne(() => User, user => user.ratingsGiven, { onDelete: 'CASCADE' })
  emitter: User;

  @ManyToOne(() => User, user => user.ratingsReceived, { onDelete: 'CASCADE' })
  receiver: User;

  @CreateDateColumn()
  createdAt: Date;
}