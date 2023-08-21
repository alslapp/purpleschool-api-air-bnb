import {
	Controller,
	UseGuards,
	BadRequestException,
	NotFoundException,
	ForbiddenException,
	Post,
	Get,
	Patch,
	Delete,
	Body,
	Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingStatusesEnum, CreateBookingDto } from './dto';
import { JwtAuthGuard } from '../auth/gards';
import { Params, Roles, UserId } from '../decorators';
import {
	ERROR_BOOKING_CANCELLED_FORBIDDEN,
	ERROR_BOOKING_CANCELLED_YET,
	ERROR_BOOKING_NOT_FOUND,
} from './booking.constants';
import { RolesGuard } from '../auth/gards/roles.guard';
import { Role } from '../user/dto/user-roles.enum';
import { onBookCancelTemplate, onBookCreateTemplate } from './notify.templates';
import { NotifierService } from '../notifier/notifier.service';
import PaginationParams from '../pagination/pagination-params.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('booking')
export class BookingController {
	constructor(
		private readonly bookingService: BookingService,
		private readonly notifierService: NotifierService,
	) {}

	@Roles(Role.USER)
	@Post()
	async create(@Body() dto: CreateBookingDto, @UserId() userId: string) {
		try {
			const book = await this.bookingService.create(userId, dto);
			this.bookingService.sendMessage(userId, book, onBookCreateTemplate);
			return book;
		} catch (error) {
			throw new BadRequestException((error as ErrorEvent).message);
		}
	}

	@Roles(Role.ADMIN, Role.USER)
	@Get()
	findAll(@Query() { skip, limit }: PaginationParams) {
		return this.bookingService.findAll({ limit, skip });
	}

	@Roles(Role.ADMIN, Role.USER)
	@Get(':id')
	async findById(@Params('id') id: string) {
		const book = await this.bookingService.findById(id);
		if (!book) {
			throw new BadRequestException(ERROR_BOOKING_NOT_FOUND);
		}
		return book;
	}

	@Roles(Role.USER)
	@Patch('cancel/:id')
	async cancelBook(@Params('id') id: string, @UserId() userId: string) {
		const book = await this.bookingService.findById(id);
		if (!book) {
			throw new NotFoundException(ERROR_BOOKING_NOT_FOUND);
		} else if (userId !== book.userId.toString()) {
			throw new ForbiddenException(ERROR_BOOKING_CANCELLED_FORBIDDEN);
		} else if (book.status === BookingStatusesEnum.CANCELLED) {
			throw new BadRequestException(ERROR_BOOKING_CANCELLED_YET);
		}
		const bookUpdated = await this.bookingService.updateById(id, {
			status: BookingStatusesEnum.CANCELLED,
		});

		if (bookUpdated) {
			this.bookingService.sendMessage(userId, bookUpdated, onBookCancelTemplate);
		}

		return bookUpdated;
	}

	@Roles(Role.ADMIN)
	@Delete(':id')
	remove(@Params('id') id: string) {
		return this.bookingService.remove(id);
	}
}
