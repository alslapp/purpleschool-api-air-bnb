import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { API_TEST_ERROR, API_TEST_PATH } from './api-test.constants';
import { Album, Comment } from './api-test.models';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';

@Injectable()
export class ApiTestService {
	constructor(private readonly httpService: HttpService) {}
	async getComments(): Promise<Comment[]> {
		const { data } = await firstValueFrom(
			this.httpService.get<Comment[]>(API_TEST_PATH.comments).pipe(
				catchError((error: AxiosError) => {
					console.log(error?.response?.data ?? 'error undefined');
					throw API_TEST_ERROR.NOT_FOUND.COMMENTS;
				}),
			),
		);
		return data;
	}

	async getAlbums(): Promise<Album[]> {
		const { data } = await firstValueFrom(
			this.httpService.get<Album[]>(API_TEST_PATH.albums).pipe(
				catchError((error: AxiosError) => {
					console.log(error?.response?.data ?? 'error undefined');
					throw API_TEST_ERROR.NOT_FOUND.ALBUMS;
				}),
			),
		);
		return data;
	}
}
