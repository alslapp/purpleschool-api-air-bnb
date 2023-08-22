import { Controller, Get, Inject, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { ApiTestService } from './api-test.service';
import { UserService } from '../user/user.service';

@Controller('api-test')
export class ApiTestController {
	constructor(
		private readonly userService: UserService,
		private readonly apiTestService: ApiTestService,
	) {}

	// @Cron(CronExpression.EVERY_SECOND)
	// @Timeout(2000)
	// async handleCron() {
	// 	console.log('cron test');
	// 	const user = await this.userService.createUser('user-1@nodomain3.net', '123456789');
	// 	console.log({
	// 		user,
	// 	});
	// }

	@Get('comments')
	async getComments() {
		try {
			return await this.apiTestService.getComments();
		} catch (error) {
			throw new NotFoundException(error);
		}
	}

	@Get('albums')
	async getAlbums() {
		try {
			return await this.apiTestService.getAlbums();
		} catch (error) {
			throw new NotFoundException(error);
		}
	}
}
