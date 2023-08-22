import { Controller, Get } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class TelegramController {
	constructor(private readonly telegramService: TelegramService) {}

	@Get()
	getHello(): string {
		return this.telegramService.getHello();
	}

	@EventPattern('send_message')
	sendMessage(@Payload() { text }: { text: string }) {
		this.telegramService.sendMessage(text);
	}
}
