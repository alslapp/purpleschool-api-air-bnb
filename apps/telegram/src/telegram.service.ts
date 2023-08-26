import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {
	bot: Telegraf;
	chatId: string;

	constructor(private readonly configService: ConfigService) {
		const token = configService.get<string>('TELEGRAM_TOKEN_HTTP_API') ?? '';
		this.chatId = configService.get<string>('TELEGRAM_CHAT_ID') ?? '';
		this.bot = new Telegraf(token);
	}

	sendMessage(message: string, chatId: string = this.chatId) {
		this.bot.telegram.sendMessage(chatId, message);
	}
}
