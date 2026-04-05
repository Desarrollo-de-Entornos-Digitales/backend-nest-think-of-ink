import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingController } from './ratings.controller';
import { ratingService } from './ratings.service';
import { Rating } from './rating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rating])],
  controllers: [RatingController],
  providers: [ratingService],
})
export class RatingsModule {}
