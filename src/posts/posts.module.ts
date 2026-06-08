import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from './post.entity';
import { PostLike } from '../likes/like.entity';
import { User } from '../users/user.entity';
import { Studio } from '../studio/studio.entity';
import { Category } from '../category/category.entity';
import { AuthModule } from '../auth/auth.module';
import { CategoryModule } from '../category/category.module';
import { LikesModule } from '../likes/likes.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostLike, User, Studio, Category]),
    forwardRef(() => AuthModule),
    CategoryModule,
    LikesModule,
    CommentsModule,
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostsModule {}
