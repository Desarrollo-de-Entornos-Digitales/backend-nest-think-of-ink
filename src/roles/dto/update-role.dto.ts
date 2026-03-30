import { CreateRole } from './create-role.dto';

import { PartialType } from '@nestjs/mapped-types';

export class UpdateRole extends PartialType(CreateRole) {}
