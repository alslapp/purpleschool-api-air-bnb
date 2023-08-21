import { Injectable } from '@nestjs/common';
import { TelegramService } from '../telegram/telegram.service';
import { TNotifyTemplate, NotifyProviders } from './notify.types';
import { format } from 'date-fns';

@Injectable()
export class NotifierService {
	constructor(private readonly telegramService: TelegramService) {}

	sendMessage(templateMessage: TNotifyTemplate, data: { [key: string]: any }) {
		NotifyProviders.forEach((provider) => {
			if (!(provider in templateMessage)) return;
			const text = this.renderTemplate(templateMessage[provider], data);

			// console.log(`send message:`);
			// console.log(text);

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
		console.log(`sendToTelegram`);
		this.telegramService.sendMessage(text);
	}

	private sendToEmail(text: string) {
		console.log(`sendToEmail`);
	}

	private sendToSms(text: string) {
		console.log(`sendToSms`);
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
