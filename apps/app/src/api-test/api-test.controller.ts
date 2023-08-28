import { Controller, Get, Inject } from '@nestjs/common';
import { API_TEST_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('api-test')
export class ApiTestController {
	constructor(@Inject(API_TEST_SERVICE) private readonly apiTestClient: ClientProxy) {}

	@Get('comments')
	getComment() {
		return this.apiTestClient.send('get_comments', {});
	}

	@Get('albums')
	getAlbums() {
		return this.apiTestClient.send('get_albums', {});
	}
}
