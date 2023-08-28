import { NestFactory } from '@nestjs/core';
import { TelegramModule } from './telegram.module';
import { RmqService } from '@app/common';

async function bootstrap() {
	const app = await NestFactory.create(TelegramModule);
	const rmqService = app.get<RmqService>(RmqService);
	app.connectMicroservice(rmqService.getOptions('TELEGRAM'));
	await app.startAllMicroservices();
}
bootstrap();
