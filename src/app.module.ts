import { Permission } from './permission/permission.entity';
import { Role_perm } from './role_perm/role_perm/role_perm.entity';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST ?? 'localhost',
      port: process.env.DATABASE_URL ? undefined : Number(process.env.DB_PORT ?? 5433),
      username: process.env.DATABASE_URL ? undefined : process.env.DB_USER ?? 'postgres',
      password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME ?? 'mydatabase',
      entities: [User, Role, Post, Comment, Rating, Category, Permission, Role_perm],
      synchronize: process.env.DB_SYNCHRONIZE !== 'false',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
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