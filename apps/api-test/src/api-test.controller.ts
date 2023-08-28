import { Controller } from '@nestjs/common';
import { ApiTestService } from './api-test.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class ApiTestController {
	constructor(private readonly apiTestService: ApiTestService) {}

	@EventPattern('get_comments')
	async getComments() {
		return this.apiTestService.getComments();
	}

	@EventPattern('get_albums')
	getAlbums() {
		return this.apiTestService.getAlbums();
	}
}
