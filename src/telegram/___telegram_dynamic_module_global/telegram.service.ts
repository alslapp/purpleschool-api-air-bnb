import { Inject, Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ITelegramOptions } from './telegram.interface';
import { TELEGRAM_MODULE_OPTIONS } from 'src/telegram/telegram.constants';

@Injectable()
export class TelegramService {
	bot: Telegraf;
	options: ITelegramOptions;

	constructor(@Inject(TELEGRAM_MODULE_OPTIONS) options: ITelegramOptions) {
		this.options = options;
		this.bot = new Telegraf(options.token);
	}

	async sendMessage(message: string, chatId: string = this.options.chatId) {
		await this.bot.telegram.sendMessage(chatId, message);
	}

	renderTemplate(template: string[], data: { [key: string]: any }): string {
		let renderedTemplate = '';
		renderedTemplate += template
			.join(`\n`)
			.replace(/{(.+?)}/g, (match, name) => {
				if (!data.hasOwnProperty(name)) return '';
				return data[name];
			})
			.trim();
		return renderedTemplate;
	}
}
