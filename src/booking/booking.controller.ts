import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto, UpdateBookingDto } from './dto';
import { MongoIdValidationPipe } from '../pipes';

@Controller('booking')
export class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	@Post()
	create(@Body() dto: CreateBookingDto) {
		return this.bookingService.create(dto);
	}

	@Get()
	findAll() {
		return this.bookingService.findAll();
	}

	@Get(':id')
	findOne(
		@Param('id', MongoIdValidationPipe)
		id: string,
	) {
		return this.bookingService.findOne(id);
	}

	@Post('cancel/:id')
	cancelBook(@Param('id', MongoIdValidationPipe) id: string) {
		return this.bookingService.cancelBook(id);
	}

	@Delete(':id')
	remove(
		@Param('id', MongoIdValidationPipe)
		id: string,
	) {
		return this.bookingService.remove(id);
	}
}
