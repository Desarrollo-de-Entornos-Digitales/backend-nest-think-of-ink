import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Role } from '../../roles/role.entity';
import { Permission } from '../../permission/permission.entity';

@Entity()
export class Role_perm {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, role => role.rolePerms, { onDelete: 'CASCADE' })
  role: Role;

  @ManyToOne(() => Permission, permission => permission.rolePerms, { onDelete: 'CASCADE' })
  permission: Permission;

}