import { Global, Module } from '@nestjs/common';
import { NotifierService } from './notifier.service';
import { TelegramModule } from '../telegram/telegram.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTelegramConfig } from '../configs';
import { UserModule } from '../user/user.module';

@Global()
@Module({
	providers: [NotifierService],
	exports: [NotifierService],
	imports: [
		TelegramModule.register({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getTelegramConfig,
		}),
		UserModule,
	],
})
export class NotifierModule {}
