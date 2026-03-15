import { Entity, PrimaryColumn, OneToMany, Column } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Role {
  @PrimaryColumn({ unique: true })
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
