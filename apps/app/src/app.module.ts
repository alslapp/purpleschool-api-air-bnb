import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingModule } from './booking/booking.module';
import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { getMongoConfig } from './configs';
import { NotifierModule } from './notifier/notifier.module';
import { ScheduleModule } from '@nestjs/schedule';
import * as Joi from 'joi';
import { RmqModule } from '@app/common';
import { TELEGRAM_SERVICE } from '@app/common';
import { ApiTestModule } from './api-test/api-test.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				JWT_SECRET: Joi.string().required(),
				MONGO_HOST: Joi.string().required(),
				MONGO_AUTHDATABASE: Joi.string().required(),
			}),
			envFilePath: './apps/app/.env',
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		ScheduleModule.forRoot(),
		BookingModule,
		RoomModule,
		UserModule,
		AuthModule,
		FilesModule,
		NotifierModule,
		RmqModule.register({
			name: TELEGRAM_SERVICE,
		}),
		ApiTestModule,
	],
})
export class AppModule {}
