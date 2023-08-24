import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import {
	ERROR_USER_VALIDATION_EMAIL,
	ERROR_USER_VALIDATION_PASSWORD_IS_TOO_LONG,
	ERROR_USER_VALIDATION_PASSWORD_IS_TOO_SHORT,
} from '../user.constants';

export const CreateUserZodSchema = z.object({
	email: z.string().email({ message: ERROR_USER_VALIDATION_EMAIL }),
	password: z.coerce // если пароль пустой, то будет  'undefined'. Если убрать coerce, то не будет приведения к строке
		.string()
		.min(5, { message: ERROR_USER_VALIDATION_PASSWORD_IS_TOO_SHORT })
		.max(15, { message: ERROR_USER_VALIDATION_PASSWORD_IS_TOO_LONG }),
	name: z.string().optional(),
	phone: z.string().optional(),
});

// class is required for using DTO as a type
export class CreateUserZodDto extends createZodDto(CreateUserZodSchema) {}
export type TCreateUserZodDto = z.infer<typeof CreateUserZodSchema>;
