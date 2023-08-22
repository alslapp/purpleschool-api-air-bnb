import { ConfigService } from '@nestjs/config';
import { IApiTestOptions } from '../api-test/api-test.interface';

export const getApiTestConfig = (configService: ConfigService): IApiTestOptions => {
	const token = configService.get('TELEGRAM_TOKEN_HTTP_API');
	if (!token) {
		throw Error('API_TEST_TOKEN не задан');
	}
	return {
		token: configService.get<string>('API_TEST_TOKEN') ?? '',
	};
};
