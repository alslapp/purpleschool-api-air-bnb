import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { MongoIdValidationPipe } from '../pipes';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	create(@Body() dto: CreateUserDto) {
		return this.userService.create(dto);
	}

	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', MongoIdValidationPipe) id: string) {
		return this.userService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id', MongoIdValidationPipe) id: string, @Body() dto: UpdateUserDto) {
		return this.userService.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id', MongoIdValidationPipe) id: string) {
		return this.userService.remove(id);
	}
}
