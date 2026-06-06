import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLike } from './like.entity';
import { LikesService } from './likes.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostLike])],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
