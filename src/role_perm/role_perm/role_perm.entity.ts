import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Role_perm {
  @PrimaryColumn({ unique: true })
  id: number;
}
