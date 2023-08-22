import { Global, Module } from '@nestjs/common';
import { NotifierService } from './notifier.service';
import { UserModule } from '../user/user.module';
import { RmqModule } from '@app/common';
import { TELEGRAM_SERVICE } from '../constants';

@Global()
@Module({
	providers: [NotifierService],
	exports: [NotifierService],
	imports: [
		UserModule,
		RmqModule.register({
			name: TELEGRAM_SERVICE,
		}),
	],
})
export class NotifierModule {}
