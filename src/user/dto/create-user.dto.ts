import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
	ERROR_USER_VALIDATION_EMAIL,
	ERROR_USER_VALIDATION_PASSWORD,
	ERROR_USER_VALIDATION_PASSWORD_IS_NOT_STRING,
} from '../user.constants';
import { Role } from './user-roles.enum';

export class CreateUserDto {
	@IsEmail({}, { message: ERROR_USER_VALIDATION_EMAIL })
	@IsString({ message: ERROR_USER_VALIDATION_EMAIL })
	@IsNotEmpty({ message: ERROR_USER_VALIDATION_EMAIL })
	email: string;

	@IsString()
	@IsOptional()
	name?: string;

	@IsString()
	@IsOptional()
	phone?: string;

	@IsString({ message: ERROR_USER_VALIDATION_PASSWORD_IS_NOT_STRING })
	@IsNotEmpty({ message: ERROR_USER_VALIDATION_PASSWORD })
	password: string;

	@IsString()
	@IsOptional()
	hash?: string;

	@IsEnum(Role, { each: true })
	@IsOptional()
	roles?: Role[];
}
