import {
	IsInt,
	IsOptional,
	IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BookingStatusesEnum } from './booking-statuses.enum';

export class CreateBookingDto {
	@IsInt()
	@Type(() => Number)
	date: number;

	@IsString()
	@IsOptional()
	status?: BookingStatusesEnum;

	@IsString()
	roomId: string;

	@IsString()
	userId: string;
}
