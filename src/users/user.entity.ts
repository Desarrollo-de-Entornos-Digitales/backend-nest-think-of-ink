import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Post } from '../posts/post.entity';
import { Comment } from '../comments/comment.entity';
import { Role } from '../roles/role.entity';
import { Rating } from '../ratings/rating.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

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
