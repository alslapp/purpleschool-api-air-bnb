import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoomDto, UpdateRoomDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from './models';
import { Model } from 'mongoose';
import { ERROR_ROOM_EXISTS, ERROR_ROOM_NOT_FOUND } from './room.constants';

@Injectable()
export class RoomService {
	constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

	async create(dto: CreateRoomDto) {
		const isRoomExists = (await this.roomModel.count({ number: dto.number })) && true;
		if (isRoomExists) {
			throw new HttpException(ERROR_ROOM_EXISTS, HttpStatus.BAD_REQUEST);
		}
		// create new room
		const newRoom = new this.roomModel(dto);
		return newRoom.save();
	}

	findAll() {
		return this.roomModel.find();
	}

	async findOne(id: string) {
		try {
			const room = await this.roomModel.findById(id);
			if (!room) throw new Error();
			return room;
		} catch (error) {
			throw new HttpException(ERROR_ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}

	async update(_id: string, dto: Omit<UpdateRoomDto, 'number'>) {
		try {
			const room = await this.roomModel.findOneAndUpdate({ _id }, { ...dto });
			if (!room) throw new Error();
			return this.findOne(_id);
		} catch (error) {
			throw new HttpException(ERROR_ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}

	remove(_id: string) {
		return this.roomModel.deleteOne({ _id });
	}
}
