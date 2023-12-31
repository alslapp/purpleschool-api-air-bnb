import {
	IsArray,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ERROR_ROOM_AREA_IS_STRING, ERROR_ROOM_AREA_TOO_LESS } from '../room.constants';
import { FileElementResponse } from '../../files/dto/file-response-element.response';

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

	@Min(1, { message: ERROR_ROOM_AREA_TOO_LESS })
	@IsNumber({}, { message: ERROR_ROOM_AREA_IS_STRING })
	@Type(() => Number)
	@IsNotEmpty()
	area: number;

	@IsNumber()
	@Type(() => Number)
	@IsNotEmpty()
	price: number;

	@IsArray()
	@ValidateNested()
	@IsOptional()
	@Type(() => FileElementResponse)
	images?: FileElementResponse[];
}
