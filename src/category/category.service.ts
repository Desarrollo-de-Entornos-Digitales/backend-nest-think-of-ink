import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './category.entity';
import { CreateCategory } from './dto/create-category.dto';
import { UpdateCategory } from './dto/update-category.dto';

const SEED_CATEGORIES = [
  { name: 'Blackwork', description: 'Tatuajes en negro y sombras' },
  { name: 'Fine Line', description: 'Línea fina y minimalista' },
  { name: 'Realismo', description: 'Retratos y arte realista' },
  { name: 'Tradicional', description: 'Estilo old school tradicional' },
  { name: 'Acuarela', description: 'Estilo acuarela y abstracto' },
  { name: 'Geométrico', description: 'Geometría sagrada y patrones' },
  { name: 'Neotradicional', description: 'Tradicional con detalles modernos' },
];

@Injectable()
export class CategoryService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async onModuleInit() {
    const count = await this.categoryRepository.count();
    if (count === 0) {
      await this.categoryRepository.save(SEED_CATEGORIES);
    }
  }

  async create(createCategory: CreateCategory): Promise<Category> {
    const newCategory = this.categoryRepository.create(createCategory);
    return await this.categoryRepository.save(newCategory);
  }

  async update(id: number, updateCategory: UpdateCategory): Promise<Category> {
    await this.categoryRepository.update(id, updateCategory);
    const updated = await this.findById(id);
    if (!updated) throw new NotFoundException(`Categoría ${id} no encontrada`);
    return updated;
  }

  async remove(id: number) {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Categoría ${id} no existe`);
    }
    return { message: 'Categoría eliminada', id };
  }

  async findById(id: number): Promise<Category | null> {
    return await this.categoryRepository.findOneBy({ id });
  }

  async findByName(name: string): Promise<Category | null> {
    return await this.categoryRepository.findOneBy({ name });
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }
}
