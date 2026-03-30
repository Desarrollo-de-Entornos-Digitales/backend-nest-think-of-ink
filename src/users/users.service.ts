import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

import { CreateUser } from './dto/create-user.dto';
import { UpdateUser } from './dto/update-user.dto';

@Injectable()
export class userService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
  ) {}
  async create(createUser: CreateUser) {
    const newUser = this.UserRepository.create({
      ...createUser,
    });

    return this.UserRepository.save(newUser);
  }
  async update(id: number, updateUser: UpdateUser) {
    await this.UserRepository.update(id, updateUser);
    return this.UserRepository.findOneBy({ id });
  }
  async remove(id: number) {
    const result = await this.UserRepository.delete(id);
    if (result.affected) {
      return { id };
    }
    return null;
  }
  findById(id: number) {
    return this.UserRepository.findOneBy({ id });
  }
  findAll() {
    return this.UserRepository.find();
  }
}
