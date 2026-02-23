import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
  ) {}

  async create(email: string, password: string, roleName: string) {
    const role = await this.rolesRepo.findOne({ where: { name: roleName } });
    if (!role) throw new BadRequestException('Role not found');

    const user = this.usersRepo.create({ email, password, role });
    return this.usersRepo.save(user);
  }

  findAll() {
    return this.usersRepo.find({ relations: { role: true } });
  }
}