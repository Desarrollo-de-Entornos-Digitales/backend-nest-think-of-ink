import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Role_perm } from '../role_perm/role_perm/role_perm.entity';

@Entity()
export class Permission {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Role_perm, rolePerm => rolePerm.permission)
  rolePerms: Role_perm[];

}