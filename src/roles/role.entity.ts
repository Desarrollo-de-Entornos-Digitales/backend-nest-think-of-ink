import { Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Role {
  @PrimaryColumn()
  name: string; // 'Admin' | 'Tatuador' | 'Regular'

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}