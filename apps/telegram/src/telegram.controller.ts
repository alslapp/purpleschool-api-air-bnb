import { Controller } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class TelegramController {
	constructor(private readonly telegramService: TelegramService) {}

	@EventPattern('send_message')
	sendMessage(@Payload() { message }: { message: string }) {
		this.telegramService.sendMessage(message);
	}
}
