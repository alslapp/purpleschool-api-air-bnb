import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { mainConfig } from './configs';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	mainConfig(app);
	const configService = app.get(ConfigService);
	const httpPort = configService.get<number>('HTTP_PORT');
	if (!httpPort) {
		console.log(
			'\x1b[31m',
			'ENV',
			'\x1b[37m',
			'\x1b[41m',
			'HTTP_PORT',
			'\x1b[0m',
			'\x1b[31m',
			'NOT DEFINED!',
			'\x1b[37m',
		);
		return;
	}

	await app.listen(httpPort);
	console.log(
		'\x1b[32m',
		'🚀 Server started on port: ',
		'\x1b[37m',
		'\x1b[42m',
		httpPort,
		'\x1b[0m',
	);
}

bootstrap();
