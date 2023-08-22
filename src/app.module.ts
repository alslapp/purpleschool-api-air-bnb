import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingModule } from './booking/booking.module';
import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { getApiTestConfig, getMongoConfig } from './configs';
import { NotifierModule } from './notifier/notifier.module';
import { ApiTestModule } from './api-test/api-test.module';
import { ScheduleModule } from '@nestjs/schedule';
import * as Joi from 'joi';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				JWT_SECRET: Joi.string().required(),
				MONGO_HOST: Joi.string().required(),
				MONGO_PORT: Joi.number().required(),
				MONGO_AUTHDATABASE: Joi.string().required(),
				TELEGRAM_TOKEN_HTTP_API: Joi.string().required(),
				API_TEST_TOKEN: Joi.string().required(),
			}),
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		ApiTestModule.register({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getApiTestConfig,
		}),
		ScheduleModule.forRoot(),
		BookingModule,
		RoomModule,
		UserModule,
		AuthModule,
		FilesModule,
		NotifierModule,
	],
})
export class AppModule {}
