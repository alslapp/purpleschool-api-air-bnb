import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';

export class UpdateBookingDto extends PartialType(
	OmitType(CreateBookingDto, ['roomId', 'userId'] as const),
) {}
