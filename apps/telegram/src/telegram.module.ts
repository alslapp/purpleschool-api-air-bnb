import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
	imports: [
		RmqModule,
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				RABBIT_MQ_URI: Joi.string().required(),
				RABBIT_MQ_TELEGRAM_QUEUE: Joi.string().required(),
				TELEGRAM_TOKEN_HTTP_API: Joi.string().required(),
				TELEGRAM_CHAT_ID: Joi.string().required(),
			}),
			envFilePath: './apps/telegram/.env',
		}),
	],
	controllers: [TelegramController],
	providers: [TelegramService],
})
export class TelegramModule {}
