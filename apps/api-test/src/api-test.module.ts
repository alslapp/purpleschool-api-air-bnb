import { Module } from '@nestjs/common';
import { ApiTestController } from './api-test.controller';
import { ApiTestService } from './api-test.service';
import {
	API_TEST_BASE_PATH,
	API_TEST_HTTP_MAX_REDIRECTS,
	API_TEST_TIMEOUT,
	RmqModule,
} from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { HttpModule } from '@nestjs/axios';

@Module({
	imports: [
		HttpModule.register({
			timeout: API_TEST_TIMEOUT,
			maxRedirects: API_TEST_HTTP_MAX_REDIRECTS,
			baseURL: API_TEST_BASE_PATH,
		}),
		RmqModule,
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				RABBIT_MQ_URI: Joi.string().required(),
				RABBIT_MQ_APITEST_QUEUE: Joi.string().required(),
				API_TEST_TOKEN: Joi.string().required(),
			}),
			envFilePath: './apps/api-test/.env',
		}),
	],
	controllers: [ApiTestController],
	providers: [ApiTestService],
})
export class ApiTestModule {}
