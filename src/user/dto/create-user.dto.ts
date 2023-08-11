import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
	ERROR_USER_VALIDATION_EMAIL,
	ERROR_USER_VALIDATION_PASSWORD,
	ERROR_USER_VALIDATION_PASSWORD_IS_NOT_STRING
} from '../user.constants';

export class CreateUserDto {
	@IsEmail({}, { message: ERROR_USER_VALIDATION_EMAIL })
	@IsString({ message: ERROR_USER_VALIDATION_EMAIL })
	@IsNotEmpty({ message: ERROR_USER_VALIDATION_EMAIL })
	email: string;

	@IsString()
	@IsOptional()
	firstName?: string;

	@IsString()
	@IsOptional()
	lastName?: string;

	@IsString({ message: ERROR_USER_VALIDATION_PASSWORD_IS_NOT_STRING })
	@IsNotEmpty({ message: ERROR_USER_VALIDATION_PASSWORD })
	password: string;
}
