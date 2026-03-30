import { CreatePermission } from './create-permission.dto';

import { PartialType } from '@nestjs/mapped-types';

export class UpdatePermission extends PartialType(CreatePermission) {}
