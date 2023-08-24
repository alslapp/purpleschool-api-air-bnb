import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, Req, UseGuards } from '@nestjs/common';
import { UserZodService } from './user-zod.service';
import { CreateUserZodDto, CreateUserZodSchema, TCreateUserZodDto } from './dto/create-user-zod.dto';
import { UpdateUserZodDto } from './dto/update-user-zod.dto';
import { ZodValidationPipe } from 'nestjs-zod';

// для тестов нужно отключить // mainConfig(app);

@Controller('user-zod')
export class UserZodController {
	constructor(private readonly userZodService: UserZodService) {}

	@Post()

	@UsePipes(new ZodValidationPipe(CreateUserZodSchema))
	create(@Body() dto: TCreateUserZodDto) {

		console.log({
			dto,
		});

		return this.userZodService.create(dto);
	}

	@Get()
	findAll() {
		return this.userZodService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userZodService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserZodDto: UpdateUserZodDto) {
		return this.userZodService.update(+id, updateUserZodDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userZodService.remove(+id);
	}
}
