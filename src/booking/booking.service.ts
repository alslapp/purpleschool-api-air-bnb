import {
	ForbiddenException,
	HttpException,
	HttpStatus,
	Injectable,
} from '@nestjs/common';
import {
	BookingStatusesEnum,
	CreateBookingDto,
	UpdateBookingDto,
} from './dto';
import { convertDateToUTC } from '../helpers/helpers';
import {
	ERROR_BOOKING_BAD_REQUEST,
	ERROR_BOOKING_DATE_PAST,
	ERROR_BOOKING_EXISTS,
	ERROR_BOOKING_NOT_FOUND,
	ERROR_BOOKING_ROOM_NOT_FOUNT,
	ERROR_BOOKING_USER_NOT_FOUNT,
} from './booking.constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
	Booking,
	BookingDocument,
} from './models';
import {
	User,
	UserDocument,
} from '../user/models';
import {
	Room,
	RoomDocument,
} from '../room/models';
import { ERROR_ROOM_NOT_FOUND } from '../room/room.constants';

@Injectable()
export class BookingService {
	constructor(
		@InjectModel(Booking.name)
		private bookingModel: Model<BookingDocument>,
		@InjectModel(User.name)
		private userModel: Model<UserDocument>,
		@InjectModel(Room.name)
		private roomModel: Model<RoomDocument>,
	) {}

	async create(dto: CreateBookingDto) {
		// find user by id
		try {
			await this.userModel.findById(dto.userId);
		} catch (error) {
			throw new HttpException(
				ERROR_BOOKING_USER_NOT_FOUNT,
				HttpStatus.BAD_REQUEST,
			);
		}

		// check room exists
		let roomFind;
		try {
			roomFind = await this.roomModel.findById(
				dto.roomId,
				'price',
			);
		} catch (error) {
			throw new HttpException(
				ERROR_ROOM_NOT_FOUND,
				HttpStatus.BAD_REQUEST,
			);
		}

		if (!roomFind) {
			throw new HttpException(
				ERROR_ROOM_NOT_FOUND,
				HttpStatus.BAD_REQUEST,
			);
		}

		// convert and normalize date to UTC
		const bookingDate = convertDateToUTC(
			dto.date,
		);

		const nowUTC = convertDateToUTC(
			Date.now() / 1000,
		);

		if (bookingDate < nowUTC) {
			throw new HttpException(
				ERROR_BOOKING_DATE_PAST,
				HttpStatus.BAD_REQUEST,
			);
		}

		// find booking by date, room id and status NOT CANCELLED

		const bookFind =
			await this.bookingModel.findOne({
				date: bookingDate,
				roomId: dto.roomId,
				status: {
					$ne: BookingStatusesEnum.CANCELLED,
				},
			});
		if (bookFind) {
			throw new HttpException(
				ERROR_BOOKING_EXISTS,
				HttpStatus.BAD_REQUEST,
			);
		}

		// create booking
		const bookNew = new this.bookingModel({
			...dto,
			date: bookingDate,
			price: roomFind.price,
		});
		return bookNew.save();
	}

	findAll() {
		return `This action returns all bookings`;
		// return this.prisma.booking.findMany();
	}

	async findOne(id: string) {
		let bookFind;
		try {
			bookFind = await this.bookingModel.findById(
				id,
			);
		} catch (error) {
			throw new HttpException(
				ERROR_BOOKING_NOT_FOUND,
				HttpStatus.BAD_REQUEST,
			);
		}
		if (!bookFind) {
			throw new HttpException(
				ERROR_BOOKING_NOT_FOUND,
				HttpStatus.BAD_REQUEST,
			);
		}
		return bookFind;
	}

	update(id: string, dto: UpdateBookingDto) {
		return `This action updates a #${id} booking`;
	}

	async cancelBooking(
		id: string,
		dto: UpdateBookingDto,
	) {
		if (
			!dto?.status ||
			!Object.values(
				BookingStatusesEnum,
			).includes(+dto.status)
		) {
			throw new HttpException(
				ERROR_BOOKING_BAD_REQUEST,
				HttpStatus.BAD_REQUEST,
			);
		}
		// if (
		// 	(status && +status) !==
		// 	BookingStatusesEnum.CANCELLED
		// )
		// 	throw new HttpException(
		// 		ERROR_BOOKING_BAD_REQUEST,
		// 		HttpStatus.CONFLICT,
		// 	);

		let findBook;
		try {
			findBook = await this.findOne(id);
		} catch (error) {
			throw new HttpException(
				ERROR_BOOKING_NOT_FOUND,
				HttpStatus.NOT_FOUND,
			);
			throw error;
		}
		findBook.status = dto.status;
		return findBook.save();
	}

	remove(id: string) {
		return `This action removes a #${id} booking`;
	}
}
