import { Injectable } from '@nestjs/common';
import { CreateRoomDto, UpdateRoomDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from './models';
import { Model } from 'mongoose';
import { convertDateToUTC } from '../helpers/helpers';
import { Booking, BookingDocument } from '../booking/models';

@Injectable()
export class RoomService {
	constructor(
		@InjectModel(Room.name) private roomModel: Model<RoomDocument>,
		@InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
	) {}

	create(dto: CreateRoomDto) {
		const newRoom = new this.roomModel(dto);
		return newRoom.save();
	}

	findAll() {
		return this.roomModel.find();
	}

	findById(id: string) {
		return this.roomModel.findById(id);
	}

	findByRoomNumber(number: number) {
		return this.roomModel.findOne({ number });
	}

	async createReportForAllRooms(date: number) {
		const dateUTC = convertDateToUTC(date);

		const from = new Date(dateUTC * 1000);
		from.setDate(1);

		const to = new Date(dateUTC * 1000);
		// устанавливаем дату - последнее число месяца
		to.setMonth(to.getMonth() + 1);
		to.setDate(1);
		to.setDate(to.getDate() - 1);
		to.setUTCHours(0);
		to.setUTCMinutes(0);
		to.setUTCSeconds(0);
		to.setUTCMilliseconds(0);

		const fromTs = from.getTime() / 1000;
		const toTs = to.getTime() / 1000;

		const report = await this.roomModel
			.aggregate()
			.lookup({
				from: 'bookings',
				localField: '_id',
				foreignField: 'roomId',
				as: 'bookings',
				pipeline: [
					{
						$match: {
							date: {
								$gte: fromTs,
								$lte: toTs,
							},
						},
					},
				],
			})
			.addFields({
				bookingCountDays: { $size: '$bookings' },
			})
			.group({
				_id: {
					number: '$number',
					bookingCountDays: '$bookingCountDays',
				},
			})
			.sort({
				_id: 1,
			});

		return {
			date,
			report: report.map((r) => r._id),
		};
	}

	async update(_id: string, data: UpdateRoomDto) {
		return this.roomModel.findOneAndUpdate({ _id }, data, { new: true });
	}

	remove(_id: string) {
		return this.roomModel.deleteOne({ _id });
	}
}
