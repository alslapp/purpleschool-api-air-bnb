import { PartialType } from '@nestjs/mapped-types';
import { CreateUserZodDto } from './create-user-zod.dto';

export class UpdateUserZodDto extends PartialType(CreateUserZodDto) {}
