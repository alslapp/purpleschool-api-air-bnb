import { Inject, Injectable, Logger } from '@nestjs/common';
import { TNotifyTemplate, NotifyProviders } from './notify.types';
import { format } from 'date-fns';
import { TELEGRAM_SERVICE } from '../constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotifierService {
	private readonly logger = new Logger(NotifierService.name);

		constructor(@Inject(TELEGRAM_SERVICE) private readonly telegramService: ClientProxy) {}

	sendMessage(templateMessage: TNotifyTemplate, data: { [key: string]: any }) {
		NotifyProviders.forEach((provider) => {
			if (!(provider in templateMessage)) return;
			const text = this.renderTemplate(templateMessage[provider], data);
			switch (provider) {
				case 'telegram':
					this.sendToTelegram(text);
					break;

				case 'email':
					this.sendToEmail(text);
					break;

				case 'sms':
					this.sendToSms(text);
					break;
			}
		});
	}

	private sendToTelegram(text: string) {
		this.logger.log(`sendToTelegram`);
		this.telegramService.emit('send_message', {
			text,
		});
		return;
	}

	private sendToEmail(text: string) {
		// this.logger.log(`sendToEmail`);
		return;
	}

	private sendToSms(text: string) {
		// this.logger.log(`sendToSms`);
		return;
	}

	renderTemplate(template: string[], data: { [key: string]: any }): string {
		let renderedTemplate = '';

		if ('date' in data && typeof data.date === 'number') {
			data.date = format(new Date(data.date * 1000), 'dd.MM.yyyy');
		}

		renderedTemplate += template
			.join(`\n`)
			.replace(/{(.+?)}/g, (match, name) => data[name])
			.trim();
		return renderedTemplate;
	}

	getTemplateData(data: any, pref = '') {
		const res: { [key: string]: string } = {};
		let prop: keyof typeof data;
		for (prop in data) {
			res[`${pref}_${prop}`] = data[prop];
		}
		return res;
	}
}
