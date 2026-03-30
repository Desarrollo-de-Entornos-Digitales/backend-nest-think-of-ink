import { CreateUser } from './create-user.dto';

import { PartialType } from '@nestjs/mapped-types';

export class UpdateUser extends PartialType(CreateUser) {}
