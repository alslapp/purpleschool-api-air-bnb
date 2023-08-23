import { ConfigService } from '@nestjs/config';
import { IApiTestOptions } from '../api-test/api-test.interface';

export const getApiTestConfig = (configService: ConfigService): IApiTestOptions => {
	const token = configService.get<string>('API_TEST_TOKEN') ?? '';
	if (token === '') {
		throw Error('API_TEST_TOKEN не задан');
	}
	return { token };
};
