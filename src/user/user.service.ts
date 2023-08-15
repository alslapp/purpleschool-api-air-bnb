import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto';
import { User, UserDocument } from './models';
import * as argon from 'argon2';
import { Role } from './dto/user-roles.enum';

@Injectable()
export class UserService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async createUser(email: string, password: string) {
		// get hash
		const hash = await argon.hash(password);

		// save user in the db
		const newUser = new this.userModel({
			email,
			hash,
		});
		return this.sanitizeUser(await newUser.save());
	}

	async createAdmin(email: string, password: string) {
		// get hash
		const hash = await argon.hash(password);

		// save user in the db
		const newUser = new this.userModel({
			email,
			hash,
			roles: [Role.ADMIN],
		});
		return this.sanitizeUser(await newUser.save());
	}

	async findAll() {
		const users = await this.userModel.find();
		return users.map(this.sanitizeUser);
	}

	async findById(id: string) {
		const user = await this.userModel.findById(id);
		return this.sanitizeUser(user);
	}

	update(_id: string, data: UpdateUserDto) {
		return this.userModel.findOneAndUpdate({ _id }, data, { new: true });
	}

	remove(_id: string) {
		return this.userModel.deleteOne({ _id });
	}

	async findUser(email: string) {
		const user = await this.userModel.findOne({ email });
		return this.sanitizeUser(user);
	}

	async findUserRaw(email: string) {
		return this.userModel.findOne({ email });
	}

	sanitizeUser(user: UserDocument | null) {
		if (!user) return null;
		const sanitized: Partial<UserDocument> = user.toObject();
		delete sanitized.hash;
		return sanitized;
	}
}
