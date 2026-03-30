import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from './role.entity';

import { CreateRole } from './dto/create-role.dto';
import { UpdateRole } from './dto/update-role.dto';

@Injectable()
export class roleService {
  constructor(
    @InjectRepository(Role)
    private readonly RoleRepository: Repository<Role>,
  ) {}
  async create(createRole: CreateRole) {
    const newRole = this.RoleRepository.create({
      ...createRole,
    });

    return this.RoleRepository.save(newRole);
  }
  async update(id: number, updateRole: UpdateRole) {
    await this.RoleRepository.update(id, updateRole);
    return this.RoleRepository.findOneBy({ id });
  }
  async remove(id: number) {
    const result = await this.RoleRepository.delete(id);
    if (result.affected) {
      return { id };
    }
    return null;
  }
  findById(id: number) {
    return this.RoleRepository.findOneBy({ id });
  }
  findAll() {
    return this.RoleRepository.find();
  }
}
