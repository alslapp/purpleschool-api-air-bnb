import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import {
	CreateBookingDto,
	UpdateBookingDto,
} from './dto';

@Controller('booking')
export class BookingController {
	constructor(
		private readonly bookingService: BookingService,
	) {}

	@Post()
	create(@Body() dto: CreateBookingDto) {
		return this.bookingService.create(dto);
	}

	@Get()
	findAll() {
		return this.bookingService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.bookingService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() dto: UpdateBookingDto,
	) {
		return this.bookingService.update(id, dto);
	}

	@Patch('status/:id')
	cancelBooking(
		@Param('id') id: string,
		@Body() dto: UpdateBookingDto,
	) {
		return this.bookingService.cancelBooking(
			id,
			dto,
		);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.bookingService.remove(id);
	}
}
