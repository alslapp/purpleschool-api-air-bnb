import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { BookingStatusesEnum } from './booking-statuses.enum';
import { ERROR_BOOKING_DATE_ERROR } from '../booking.constants';

export class CreateBookingDto {
	// дата передается в виде timestamp в секундах
	@IsInt({ message: ERROR_BOOKING_DATE_ERROR })
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
