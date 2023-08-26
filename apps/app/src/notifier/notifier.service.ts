import { Inject, Injectable, Logger } from '@nestjs/common';
import { TNotifyTemplate, NotifyProviders } from './notify.types';
import { TELEGRAM_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotifierService {
	private readonly logger = new Logger(NotifierService.name);

	constructor(@Inject(TELEGRAM_SERVICE) private readonly telegramService: ClientProxy) {}

	sendMessage<T extends object>(templateMessage: TNotifyTemplate, data: T) {
		NotifyProviders.forEach((provider) => {
			if (!(provider in templateMessage)) {
				return;
			}

			const message = this.renderTemplate<T>(templateMessage[provider], data);

			switch (provider) {
				case 'telegram':
					this.sendToTelegram(message);
					break;

				case 'email':
					this.sendToEmail(message);
					break;

				case 'sms':
					this.sendToSms(message);
					break;
			}
		});
	}

	private sendToTelegram(message: string) {
		this.telegramService.emit('send_message', { message });
		this.logger.log(`sendToTelegram`);
		return;
	}

	private sendToEmail(message: string) {
		this.logger.log(`sendToEmail`);
		return;
	}

	private sendToSms(message: string) {
		this.logger.log(`sendToSms`);
		return;
	}

	renderTemplate<T extends object>(template: string[], data: T, separator = '\n'): string {
		return template
			.join(separator)
			.replace(/{(.+?)}/g, (match: string, key: keyof T): string => (key in data ? data[key] : ''))
			.trim();
	}
}
