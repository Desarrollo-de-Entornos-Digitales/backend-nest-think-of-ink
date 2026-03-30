import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ratingService } from './ratings.service';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: ratingService) {}

  @Get()
  findAll() {
    return this.ratingService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.ratingService.findById(id);
  }

  @Post()
  create(@Body() CreateRating: any) {
    return this.ratingService.create(CreateRating);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() UpdateRating: any) {
    return this.ratingService.update(id, UpdateRating);
  }

  // 5. ELIMINAR
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ratingService.remove(id);
  }
}
