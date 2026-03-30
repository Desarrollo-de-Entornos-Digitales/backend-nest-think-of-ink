import { CreateCategory } from './create-category.dto';

import { PartialType } from '@nestjs/mapped-types';

export class UpdateCategory extends PartialType(CreateCategory) {}
