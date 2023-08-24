import { Inject, Controller, Get, BadRequestException } from '@nestjs/common';
import { API_TEST_SERVICE } from '../constants';
import { ClientProxy } from '@nestjs/microservices';
import { API_TEST_ERROR } from '@app/common';
import { firstValueFrom, catchError } from 'rxjs';

@Controller('api-test')
export class ApiTestController {
	constructor(@Inject(API_TEST_SERVICE) private readonly apiTestClient: ClientProxy) {}

	@Get('comments')
	async getComments() {
		return await firstValueFrom(
			this.apiTestClient.send('get_comments', {}).pipe(
				catchError(() => {
					throw new BadRequestException(API_TEST_ERROR.NOT_FOUND.COMMENTS);
				}),
			),
		);
	}

	@Get('albums')
	async getAlbums() {
		return await firstValueFrom(
			this.apiTestClient.send('get_albums', {}).pipe(
				catchError(() => {
					throw new BadRequestException(API_TEST_ERROR.NOT_FOUND.ALBUMS);
				}),
			),
		);
	}
}
