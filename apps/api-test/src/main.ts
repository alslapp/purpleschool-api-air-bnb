import { NestFactory } from '@nestjs/core';
import { RmqService } from '@app/common';
import { ApiTestModule } from './api-test.module';

async function bootstrap() {
	const app = await NestFactory.create(ApiTestModule);
	const rmqService = app.get<RmqService>(RmqService);
	app.connectMicroservice(rmqService.getOptions('APITEST'));
	await app.startAllMicroservices();
}
bootstrap();
