import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ERROR_NOT_IS_EMAIL, ERROR_PASSWORD_EMPTY } from '../auth.constants';

export class AuthDto {
	@IsEmail({}, { message: ERROR_NOT_IS_EMAIL })
	@IsNotEmpty()
	login: string;

	@IsString()
	@IsNotEmpty({ message: ERROR_PASSWORD_EMPTY })
	password: string;
}
