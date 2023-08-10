import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoomDto {
	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	number: number;

	@IsString()
	@IsNotEmpty()
	type: string;

	@IsString()
	@IsNotEmpty()
	title: string;

	@IsNumber()
	@Type(() => Number)
	@IsNotEmpty()
	area: number;

	@IsNumber()
	@Type(() => Number)
	@IsNotEmpty()
	price: number;
}
