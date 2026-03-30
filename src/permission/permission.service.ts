import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Permission } from './permission.entity';

import { CreatePermission } from './dto/create-permission.dto';
import { UpdatePermission } from './dto/update-permission.dto';

@Injectable()
export class permissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}
  async create(createPermission: CreatePermission) {
    const newPermission = this.permissionRepository.create({
      ...createPermission,
    });

    return this.permissionRepository.save(newPermission);
  }
  async update(id: number, updatePermission: UpdatePermission) {
    await this.permissionRepository.update(id, updatePermission);
    return this.permissionRepository.findOneBy({ id });
  }
  async remove(id: number) {
    const result = await this.permissionRepository.delete(id);
    if (result.affected) {
      return { id };
    }
    return null;
  }
  findById(id: number) {
    return this.permissionRepository.findOneBy({ id });
  }
  findAll() {
    return this.permissionRepository.find();
  }
}
