import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { Exclude } from 'class-transformer';

export class CreateUserDto {
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsOptional()
	firstName?: string;

	@IsString()
	@IsOptional()
	lastName?: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}
