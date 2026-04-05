import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
<<<<<<< HEAD
import { RoleService } from './roles.service';
=======
import { roleService } from './roles.service';
>>>>>>> 905eb4bf5e36404483d7fa2ceb9b4fd3304a74a6
import { RoleController } from './roles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
<<<<<<< HEAD
  providers: [RoleService],
=======
  providers: [roleService],
>>>>>>> 905eb4bf5e36404483d7fa2ceb9b4fd3304a74a6
  controllers: [RoleController],
})
export class RolesModule {}
