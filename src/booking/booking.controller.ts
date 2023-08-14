import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	UseGuards,
	ForbiddenException,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingStatusesEnum, CreateBookingDto } from './dto';
import { MongoIdValidationPipe } from '../pipes';
import { JwtAuthGuard } from '../auth/gards';
import { Roles, UserId } from '../decorators';
import {
	ERROR_BOOKING_CANCELLED_FORBIDDEN,
	ERROR_BOOKING_CANCELLED_YET,
	ERROR_BOOKING_NOT_FOUND
} from './booking.constants';
import { RolesGuard } from '../auth/gards/roles.guard';
import { Role } from '../user/dto/user-roles.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('booking')
export class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	@Roles(Role.USER)
	@Post()
	create(@Body() dto: CreateBookingDto, @UserId() userId: string) {
		return this.bookingService.create(userId, dto);
	}

	@Roles(Role.ADMIN, Role.USER)
	@Get()
	findAll() {
		return this.bookingService.findAll();
	}

	@Roles(Role.ADMIN, Role.USER)
	@Get(':id')
	async findById(@Param('id', MongoIdValidationPipe) id: string) {
		const book = await this.bookingService.findById(id);
		if (!book) {
			throw new BadRequestException(ERROR_BOOKING_NOT_FOUND);
		}
		return book;
	}

	@Roles(Role.USER)
	@Patch('cancel/:id')
	async cancelBook(@Param('id', MongoIdValidationPipe) id: string, @UserId() userId: string) {
		const book = await this.bookingService.findById(id);
		if (!book) {
			throw new NotFoundException(ERROR_BOOKING_NOT_FOUND);
		} else if (userId !== book.userId.toString()) {
			throw new ForbiddenException(ERROR_BOOKING_CANCELLED_FORBIDDEN);
		} else if (book.status === BookingStatusesEnum.CANCELLED) {
			throw new BadRequestException(ERROR_BOOKING_CANCELLED_YET);
		}
		return this.bookingService.updateById(id, { status: BookingStatusesEnum.CANCELLED });
	}

	@Roles(Role.ADMIN)
	@Delete(':id')
	remove(@Param('id', MongoIdValidationPipe) id: string) {
		return this.bookingService.remove(id);
	}
}
