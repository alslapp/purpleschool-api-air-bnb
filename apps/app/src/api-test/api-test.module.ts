import { DynamicModule, Provider, Module, Global } from '@nestjs/common';
import { ApiTestService } from './api-test.service';
import { IApiTestModuleAsyncOptions } from './api-test.interface';
import {
	API_TEST_BASE_PATH,
	API_TEST_HTTP_MAX_REDIRECTS,
	API_TEST_MODULE_OPTIONS,
	API_TEST_TIMEOUT,
} from './api-test.constants';

import { UserModule } from '../user/user.module';
import { HttpModule } from '@nestjs/axios';
import { ApiTestController } from './api-test.controller';

@Global()
@Module({
	imports: [
		UserModule,
		HttpModule.register({
			timeout: API_TEST_TIMEOUT,
			maxRedirects: API_TEST_HTTP_MAX_REDIRECTS,
			baseURL: API_TEST_BASE_PATH,
		}),
	],
})
export class ApiTestModule {
	static register(options: IApiTestModuleAsyncOptions): DynamicModule {
		const asyncOptions = this.createAsyncOptionsProvider(options);
		return {
			module: ApiTestModule,
			imports: options.imports,
			providers: [ApiTestService, asyncOptions],
			exports: [ApiTestService],
			controllers: [ApiTestController],
		};
	}

	private static createAsyncOptionsProvider(options: IApiTestModuleAsyncOptions): Provider {
		return {
			provide: API_TEST_MODULE_OPTIONS,
			useFactory: async (...args: any[]) => await options.useFactory(...args),
			inject: options.inject || [],
		};
	}
}
