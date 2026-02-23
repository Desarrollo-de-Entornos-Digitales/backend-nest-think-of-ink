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

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_name' })
  role: Role;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Rating, (rating) => rating.emitter)
  ratingsGiven: Rating[];

  @OneToMany(() => Rating, (rating) => rating.receiver)
  ratingsReceived: Rating[];
}