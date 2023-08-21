import { ITelegramOptions } from 'src/telegram/telegram.interface';
import { ConfigService } from '@nestjs/config';

export const getTelegramConfig = (configService: ConfigService): ITelegramOptions => {
	const token = configService.get('TELEGRAM_TOKEN_HTTP_API');
	if (!token) {
		throw Error('TELEGRAM_TOKEN_HTTP_API не задан');
	}
	return {
		token,
		chatId: configService.get<string>('TELEGRAM_CHAT_ID') ?? '',
	};
};
