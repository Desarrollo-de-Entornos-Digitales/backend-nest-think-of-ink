import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from './post.entity';
import { AuthModule } from '../auth/auth.module';
import { CategoryModule } from '../category/category.module';
import { LikesModule } from '../likes/likes.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), AuthModule, CategoryModule, LikesModule, CommentsModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostsModule {}
