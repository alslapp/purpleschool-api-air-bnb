import {
	Controller,
	Get,
	Body,
	Patch,
	Delete,
	NotFoundException,
	UseGuards,
	ForbiddenException,
	Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto';
import { ERROR_USER_FORBIDDEN, ERROR_USER_NOT_FOUND } from './user.constants';
import { JwtAuthGuard } from '../auth/gards';
import { RolesGuard } from '../auth/gards/roles.guard';
import { Params, Roles, UserId } from '../decorators';
import { Role } from './dto/user-roles.enum';
import PaginationParams from '../pagination/pagination-params.dto';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@Get()
	findAll(@Query() { skip, limit }: PaginationParams) {
		return this.userService.findAll({ skip, limit });
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.USER)
	@Get(':id')
	async findById(@Params('id') id: string, @UserId() userId: string) {
		if (id !== userId) {
			throw new ForbiddenException(ERROR_USER_FORBIDDEN);
		}
		const user = await this.userService.findById(id);
		if (!user) {
			throw new NotFoundException(ERROR_USER_NOT_FOUND);
		}
		return user;
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	update(@Params('id') id: string, @Body() dto: UpdateUserDto, @UserId() userId: string) {
		if (id !== userId) {
			throw new ForbiddenException(ERROR_USER_FORBIDDEN);
		}
		return this.userService.update(id, dto);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async remove(@Params('id') id: string, @UserId() userId: string) {
		if (id !== userId) {
			throw new ForbiddenException(ERROR_USER_FORBIDDEN);
		}
		const user = await this.userService.findById(id);
		if (!user) {
			throw new NotFoundException(ERROR_USER_NOT_FOUND);
		}
		return this.userService.remove(id);
	}
}
