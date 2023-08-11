import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { mainConfig } from './main.config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	mainConfig(app);
	await app.listen(3338);
}

bootstrap();
