import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './category.entity';

import { CreateCategory } from './dto/create-category.dto';
import { UpdateCategory } from './dto/update-category.dto';

@Injectable()
export class categoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategory: CreateCategory) {
    const newCategory = this.categoryRepository.create({
      ...createCategory,
    });

    return this.categoryRepository.save(newCategory);
  }
  async update(id: number, updateCategory: UpdateCategory) {
    await this.categoryRepository.update(id, updateCategory);
    return this.categoryRepository.findOneBy({ id });
  }
  async remove(id: number) {
    const result = await this.categoryRepository.delete(id);
    if (result.affected) {
      return { id };
    }
    return null;
  }
  findById(id: number) {
    return this.categoryRepository.findOneBy({ id });
  }
  findAll() {
    return this.categoryRepository.find();
  }
}
