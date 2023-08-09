import {
	HttpException,
	HttpStatus,
	Injectable,
} from '@nestjs/common';
import {
	CreateRoomDto,
	UpdateRoomDto,
} from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from './models';
import { Model } from 'mongoose';
import { ERROR_ROOM_EXISTS } from './room.constants';

@Injectable()
export class RoomService {
	constructor(
		@InjectModel(Room.name)
		private roomModel: Model<RoomDocument>,
	) {}
	async create(dto: CreateRoomDto) {
		const isRoomExists =
			(await this.roomModel.count({
				number: dto.number,
			})) && true;

		if (isRoomExists) {
			throw new HttpException(
				ERROR_ROOM_EXISTS,
				HttpStatus.BAD_REQUEST,
			);
		}

		// create new room
		const newRoom = new this.roomModel(dto);
		return newRoom.save();
	}

	findAll() {
		return this.roomModel.find();
	}

	findOne(id: string) {
		return `This action returns a #${id} room`;
	}

	update(id: string, dto: UpdateRoomDto) {
		return `This action updates a #${id} room`;
	}

	remove(id: string) {
		return `This action removes a #${id} room`;
	}
}
