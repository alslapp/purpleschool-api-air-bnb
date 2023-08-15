import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	NotFoundException,
	BadRequestException, HttpCode, HttpStatus,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto, UpdateRoomDto } from './dto';
import { MongoIdValidationPipe } from '../pipes';
import { Roles } from '../decorators';
import { Role } from '../user/dto/user-roles.enum';
import { RolesGuard } from '../auth/gards/roles.guard';
import { JwtAuthGuard } from '../auth/gards';
import { ERROR_ROOM_NOT_FOUND, ERROR_ROOM_EXISTS } from './room.constants';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('room')
export class RoomController {
	constructor(private readonly roomService: RoomService) {}

	@Roles(Role.ADMIN)
	@Post()
	async create(@Body() dto: CreateRoomDto) {
		const room = await this.roomService.findByRoomNumber(dto.number);
		if (room) {
			throw new BadRequestException(ERROR_ROOM_EXISTS);
		}
		return this.roomService.create(dto);
	}

	@Roles(Role.ADMIN, Role.USER)
	@Get()
	findAll() {
		return this.roomService.findAll();
	}

	@Roles(Role.ADMIN, Role.USER)
	@Get(':id')
	async findById(@Param('id', MongoIdValidationPipe) id: string) {
		const room = await this.roomService.findById(id);
		if (!room) {
			throw new NotFoundException(ERROR_ROOM_NOT_FOUND);
		}
		return room;
	}


	@Roles(Role.ADMIN)
	@HttpCode(HttpStatus.OK)
	@Post('report')
	async createReportForAllRooms(@Body('date') date: number) {
		return this.roomService.createReportForAllRooms(date);
	}

	@Roles(Role.ADMIN)
	@Patch(':id')
	async update(@Param('id', MongoIdValidationPipe) id: string, @Body() dto: UpdateRoomDto) {
		const room = await this.roomService.findById(id);
		if (!room) {
			throw new NotFoundException(ERROR_ROOM_NOT_FOUND);
		}
		return this.roomService.update(id, dto);
	}

	@Roles(Role.ADMIN)
	@Delete(':id')
	async remove(@Param('id', MongoIdValidationPipe) id: string) {
		const room = await this.roomService.findById(id);
		if (!room) {
			throw new NotFoundException(ERROR_ROOM_NOT_FOUND);
		}
		return this.roomService.remove(id);
	}
}
