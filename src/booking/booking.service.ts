import { Injectable } from '@nestjs/common';
import { BookingStatusesEnum, CreateBookingDto, UpdateBookingDto } from './dto';
import { ERROR_BOOKING_DATE_PAST, ERROR_BOOKING_EXISTS } from './booking.constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './models';
import { ERROR_ROOM_NOT_FOUND } from '../room/room.constants';
import { RoomService } from '../room/room.service';
import { TNotifyTemplate } from '../notifier/notify.types';
import { ERROR_USER_NOT_FOUND } from '../user/user.constants';
import { UserService } from '../user/user.service';
import { NotifierService } from '../notifier/notifier.service';
import { convertDateToUTC } from '../helpers/helpers';

@Injectable()
export class BookingService {
	constructor(
		@InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
		private readonly roomService: RoomService,
		private readonly userService: UserService,
		private readonly notifierService: NotifierService,
	) {}

	async create(userId: string, dto: CreateBookingDto) {
		const roomFind = await this.roomService.findById(dto.roomId, 'price');
		if (!roomFind) {
			throw new Error(ERROR_ROOM_NOT_FOUND);
		}

		// попробовал реализовать этот все через либу date-fns, но получается кода еще больше
		const bookingDate = convertDateToUTC(dto.date);

		const nowUTC = convertDateToUTC(Date.now() / 1000);
		if (bookingDate < nowUTC) {
			throw new Error(ERROR_BOOKING_DATE_PAST);
		}

		const bookFind = await this.bookingModel.findOne({
			date: bookingDate,
			roomId: roomFind.id,
			// если бронь на дату и комнату есть, но отмененная, считаем что брони нет
			status: { $ne: BookingStatusesEnum.CANCELLED },
		});

		if (bookFind) {
			throw new Error(ERROR_BOOKING_EXISTS);
		}

		const bookNew = new this.bookingModel({
			...dto,
			date: bookingDate,
			price: roomFind.price,
			userId,
		});
		return await bookNew.save();
	}

	findAll(options: { limit?: number; skip?: number } = {}) {
		return this.bookingModel.find({}, {}, options);
	}

	findById(_id: string) {
		return this.bookingModel.findOne({ _id });
	}

	updateById(_id: string, data: UpdateBookingDto) {
		return this.bookingModel.findOneAndUpdate({ _id }, data, { new: true });
	}

	remove(_id: string) {
		return this.bookingModel.deleteOne({ _id });
	}

	async sendMessage(userId: string, book: BookingDocument, template: TNotifyTemplate) {
		const user = await this.userService.findById(userId, 'name phone');
		if (!user) {
			throw new Error(ERROR_USER_NOT_FOUND);
		}

		const room = await this.roomService.findById(book.roomId.toString(), 'number');
		if (!room) {
			throw new Error(ERROR_ROOM_NOT_FOUND);
		}

		// в методе notifierService.getTemplateData не разобрался, какой тип указать для data
		// указал any
		const userData = this.notifierService.getTemplateData(user, 'user');
		const roomData = this.notifierService.getTemplateData(room, 'room');

		// мне кажется, тут что то не правильно написано
		this.notifierService.sendMessage(template, {
			...book.toObject(),
			...userData,
			...roomData,
		});
	}
}
