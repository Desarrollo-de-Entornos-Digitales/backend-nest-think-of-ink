import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  AfterLoad,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';
import { Category } from '../category/category.entity';
import { PostLike } from '../likes/like.entity';
import { Studio } from '../studio/studio.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user!: User;

  @Column('text')
  content!: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  title!: string;

  @Column({ nullable: true })
  location!: string;

  @Column({ nullable: true })
  postType!: string;

  @Column({ nullable: true, type: 'int' })
  priceMin!: number;

  @Column({ nullable: true, type: 'int' })
  priceMax!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Category, (category) => category.posts)
  category!: Category;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];

  @OneToMany(() => PostLike, (like) => like.post)
  likes!: PostLike[];

  @ManyToOne(() => Studio, { nullable: true })
  studio!: Studio;

  likesCount!: number;
  commentsCount!: number;

  @AfterLoad()
  addCounts() {
    this.likesCount = this.likes?.length ?? 0;
    this.commentsCount = this.comments?.length ?? 0;
  }
}
