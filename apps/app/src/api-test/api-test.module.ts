import { Module } from '@nestjs/common';
import { ApiTestController } from './api-test.controller';
import { API_TEST_SERVICE, RmqModule } from '@app/common';

@Module({
	controllers: [ApiTestController],
	imports: [
		RmqModule.register({
			name: API_TEST_SERVICE,
		}),
	],
})
export class ApiTestModule {}
