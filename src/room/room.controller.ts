import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto, UpdateRoomDto } from './dto';
import { MongoIdValidationPipe } from '../pipes';
import { Roles } from '../decorators';
import { Role } from '../user/dto/user-roles.enum';
import { RolesGuard } from '../auth/gards/roles.guard';
import { JwtAuthGuard } from '../auth/gards';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('room')
export class RoomController {
	constructor(private readonly roomService: RoomService) {}

	@Roles(Role.ADMIN)
	@Post()
	create(@Body() dto: CreateRoomDto) {
		return this.roomService.create(dto);
	}

	@Roles(Role.ADMIN, Role.USER)
	@Get()
	findAll() {
		return this.roomService.findAll();
	}

	@Roles(Role.ADMIN, Role.USER)
	@Get(':id')
	findOne(@Param('id', MongoIdValidationPipe) id: string) {
		return this.roomService.findOne(id);
	}

	@Roles(Role.ADMIN)
	@Patch(':id')
	update(@Param('id', MongoIdValidationPipe) id: string, @Body() dto: UpdateRoomDto) {
		return this.roomService.update(id, dto);
	}

	@Roles(Role.ADMIN)
	@Delete(':id')
	remove(@Param('id', MongoIdValidationPipe) id: string) {
		return this.roomService.remove(id);
	}
}
