import { Injectable } from '@nestjs/common';
import { CreateUserZodDto } from './dto/create-user-zod.dto';
import { UpdateUserZodDto } from './dto/update-user-zod.dto';

@Injectable()
export class UserZodService {
	create(createUserZodDto: CreateUserZodDto) {
		return 'This action adds a new userZod';
	}

	findAll() {
		return `This action returns all userZod`;
	}

	findOne(id: number) {
		return `This action returns a #${id} userZod`;
	}

	update(id: number, updateUserZodDto: UpdateUserZodDto) {
		return `This action updates a #${id} userZod`;
	}

	remove(id: number) {
		return `This action removes a #${id} userZod`;
	}
}
