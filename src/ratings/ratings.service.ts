import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rating } from './rating.entity';

import { CreateRating } from './dto/create-rating.dto';
import { UpdateRating } from './dto/update-rating.dto';

@Injectable()
export class ratingService {
  constructor(
    @InjectRepository(Rating)
    private readonly RatingRepository: Repository<Rating>,
  ) {}
  async create(createRating: CreateRating) {
    const newRating = this.RatingRepository.create({
      ...createRating,
    });

    return this.RatingRepository.save(newRating);
  }
  async update(id: number, updateRating: UpdateRating) {
    await this.RatingRepository.update(id, updateRating);
    return this.RatingRepository.findOneBy({ id });
  }
  async remove(id: number) {
    const result = await this.RatingRepository.delete(id);
    if (result.affected) {
      return { id };
    }
    return null;
  }
  findById(id: number) {
    return this.RatingRepository.findOneBy({ id });
  }
  findAll() {
    return this.RatingRepository.find();
  }
}
