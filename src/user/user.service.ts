import {
	HttpStatus,
	HttpException,
	Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
	CreateUserDto,
	UpdateUserDto,
} from './dto';
import { User, UserDocument } from './models';
import * as argon from 'argon2';

import {
	ERROR_USER_EXISTS,
	ERROR_USER_NOT_FOUND,
} from './user.constants';


@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name)
		private userModel: Model<UserDocument>,
	) {}

	async create(dto: CreateUserDto) {
		const isUserExists =
			(await this.userModel.count({
				email: dto.email,
			})) && true;

		if (isUserExists) {
			throw new HttpException(
				ERROR_USER_EXISTS,
				HttpStatus.BAD_REQUEST,
			);
		}

		// get hash
		const hash = await argon.hash(dto.password);

		// save user in the db
		const newUser = new this.userModel({
			...dto,
			hash,
		});
		return newUser.save();
	}

	async findAll() {
		return this.userModel.find();
	}

	async findOne(id: string) {
		let product;
		try {
			product = await this.userModel.findById(id);
		} catch (error) {
			throw new HttpException(
				ERROR_USER_NOT_FOUND,
				HttpStatus.NOT_FOUND,
			);
		}
		return product;
	}

	update(id: string, dto: UpdateUserDto) {
		return `This action updates a #${id} user`;
	}

	remove(id: string) {
		return `This action removes a #${id} user`;
	}
}
