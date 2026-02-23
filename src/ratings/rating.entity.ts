import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
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

  @ManyToOne(() => User, (user) => user.ratingsGiven, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'emitter_id' })
  emitter: User;

  @ManyToOne(() => User, (user) => user.ratingsReceived, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @CreateDateColumn()
  createdAt: Date;
}