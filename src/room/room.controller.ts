import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto, UpdateRoomDto } from './dto';
import { MongoIdValidationPipe } from '../pipes';

@Controller('room')
export class RoomController {
	constructor(private readonly roomService: RoomService) {}

	@Post()
	create(@Body() dto: CreateRoomDto) {
		return this.roomService.create(dto);
	}

	@Get()
	findAll() {
		return this.roomService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', MongoIdValidationPipe) id: string) {
		return this.roomService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id', MongoIdValidationPipe) id: string, @Body() dto: UpdateRoomDto) {
		return this.roomService.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id', MongoIdValidationPipe) id: string) {
		return this.roomService.remove(id);
	}
}
