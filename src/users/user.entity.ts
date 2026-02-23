import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Role } from '../roles/role.entity';
import { Post } from '../posts/post.entity';
import { Comment } from '../comments/comment.entity';
import { Rating } from '../ratings/rating.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (r) => r.users, { eager: true })
  @JoinColumn({ name: 'role_name' })
  role: Role;

  @OneToMany(() => Post, (p) => p.author)
  posts: Post[];

  @OneToMany(() => Comment, (c) => c.author)
  comments: Comment[];

  @OneToMany(() => Rating, (r) => r.emitter)
  ratingsGiven: Rating[];

  @OneToMany(() => Rating, (r) => r.receiver)
  ratingsReceived: Rating[];
}