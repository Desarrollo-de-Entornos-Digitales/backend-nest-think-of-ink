import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../posts/post.entity';
import { Comment } from '../comments/comment.entity';
import { Role } from '../roles/role.entity';
import { Rating } from '../ratings/rating.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  profession: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  linkedin: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  behance: string;

  @Column({ nullable: true })
  portfolio: string;

  @Column({ nullable: true, type: 'text' })
  bio: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  location: string;

  @Column({ default: 0 })
  followersCount: number;

  @Column({ default: 0 })
  followingCount: number;

  // RELACIÓN CON POSTS
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  // RELACIÓN CON COMMENTS
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  // RELACIÓN CON ROLE
  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  // RATINGS QUE EL USUARIO DA
  @OneToMany(() => Rating, (rating) => rating.emitter)
  ratingsGiven: Rating[];

  // RATINGS QUE EL USUARIO RECIBE
  @OneToMany(() => Rating, (rating) => rating.receiver)
  ratingsReceived: Rating[];
}
