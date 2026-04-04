import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { CreateUser } from './dto/create-user.dto';
import { UpdateUser } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}


  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }


  async create(createUser: CreateUser) {
    const newUser = this.userRepository.create(createUser);
    return this.userRepository.save(newUser);
  }

  async update(id: number, updateUser: UpdateUser) {
    await this.userRepository.update(id, updateUser);
    return this.userRepository.findOneBy({ id });
  }
  async remove(id: number) {
  return this.userRepository.delete(id);
}

  findById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findAll() {
    return this.userRepository.find();
  }
}
