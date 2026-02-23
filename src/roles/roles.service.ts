import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private rolesRepo: Repository<Role>) {}

  async seedDefaults() {
    const defaults = ['Admin', 'Tatuador', 'Regular'];

    for (const name of defaults) {
      const exists = await this.rolesRepo.findOne({ where: { name } });
      if (!exists) await this.rolesRepo.save(this.rolesRepo.create({ name }));
    }

    return this.rolesRepo.find();
  }

  findAll() {
    return this.rolesRepo.find();
  }
}