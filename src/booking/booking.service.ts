import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BookingStatusesEnum, CreateBookingDto } from './dto';
import { convertDateToUTC } from '../helpers/helpers';
import {
	ERROR_BOOKING_DATE_PAST,
	ERROR_BOOKING_EXISTS,
	ERROR_BOOKING_NOT_FOUND,
	ERROR_BOOKING_USER_NOT_FOUNT,
} from './booking.constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './models';
import { User, UserDocument } from '../user/models';
import { Room, RoomDocument } from '../room/models';
import { ERROR_ROOM_NOT_FOUND } from '../room/room.constants';

@Injectable()
export class BookingService {
	constructor(
		@InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		@InjectModel(Room.name) private roomModel: Model<RoomDocument>,
	) {}

	async create(dto: CreateBookingDto) {
		// find user by id
		try {
			await this.userModel.findById(dto.userId);
		} catch (error) {
			throw new HttpException(ERROR_BOOKING_USER_NOT_FOUNT, HttpStatus.BAD_REQUEST);
		}

		// check user exists
		const userFind = await this.userModel.findById(dto.userId);
		if (!userFind) {
			throw new HttpException(ERROR_BOOKING_USER_NOT_FOUNT, HttpStatus.BAD_REQUEST);
		}

		// check room exists
		const roomFind = await this.roomModel.findById(dto.roomId, 'price');
		if (!roomFind) {
			throw new HttpException(ERROR_ROOM_NOT_FOUND, HttpStatus.BAD_REQUEST);
		}

		const bookingDate = convertDateToUTC(dto.date);
		// current time UTC
		const nowUTC = convertDateToUTC(Date.now() / 1000);
		if (bookingDate < nowUTC) {
			throw new HttpException(ERROR_BOOKING_DATE_PAST, HttpStatus.BAD_REQUEST);
		}

		// find booking by: date, roomId, status != 'CANCELLED'
		const bookFind = await this.bookingModel.findOne({
			date: bookingDate,
			roomId: roomFind.id,
			// если бронь на дату и комнату есть, но отмененная, считаем что брони нет
			status: { $ne: BookingStatusesEnum.CANCELLED },
		});
		if (bookFind) {
			throw new HttpException(ERROR_BOOKING_EXISTS, HttpStatus.BAD_REQUEST);
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
		return this.bookingModel.find();
	}

	async findOne(id: string) {
		const bookFind = await this.bookingModel.findById(id);
		if (!bookFind) {
			throw new HttpException(ERROR_BOOKING_NOT_FOUND, HttpStatus.BAD_REQUEST);
		}
		return bookFind;
	}

	async cancelBook(id: string) {
		// проверяем, что статус, который пришёл с клиента, соотв. BookingStatusesEnum
		// if (!dto?.status || !Object.values(BookingStatusesEnum).includes(+dto.status)) {
		// 	throw new HttpException(ERROR_BOOKING_BAD_REQUEST, HttpStatus.BAD_REQUEST);
		// }
		const findBook = await this.findOne(id);
		if (!findBook) {
			throw new HttpException(ERROR_BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		findBook.status = BookingStatusesEnum.CANCELLED;
		return findBook.save();
	}

	remove(_id: string) {
		return this.bookingModel.deleteOne({ _id });
	}
}
