
// podemos apreciar por aqui  la conexion con postgreSQL y el uso de typeORM



import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './users/user.entity';
import { Role } from './roles/role.entity';
import { Post } from './posts/post.entity';
import { Comment } from './comments/comment.entity';
import { Rating } from './ratings/rating.entity';

import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { RatingsModule } from './ratings/ratings.module';
import { CategoryModule } from './category/category.module';
import { StudioModule } from './studio/studio.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'think_of_ink',
      entities: [User, Role, Post, Comment, Rating],
      synchronize: true,
    }),

    UsersModule,
    RolesModule,
    PostsModule,
    CommentsModule,
    RatingsModule,
    CategoryModule,
    StudioModule,
    PermissionModule,
  ],
})
export class AppModule {}