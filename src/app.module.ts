import { Permission } from './permission/permission.entity';
import { Role_perm } from './role_perm/role_perm/role_perm.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './users/user.entity';
import { Role } from './roles/role.entity';
import { Post } from './posts/post.entity';
import { Comment } from './comments/comment.entity';
import { Rating } from './ratings/rating.entity';
import { Category } from './category/category.entity';

import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { RatingsModule } from './ratings/ratings.module';
import { CategoryModule } from './category/category.module';
import { StudioModule } from './studio/studio.module';
import { PermissionModule } from './permission/permission.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5433,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'mydatabase',

      entities: [
        User,
        Role,
        Post,
        Comment,
        Rating,
        Category,
        Permission,
        Role_perm,
      ],

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
    AuthModule,
  ],
})
export class AppModule {}