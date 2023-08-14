import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingModule } from './booking/booking.module';
import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		MongooseModule.forRoot('mongodb://localhost:27117/test'),
		BookingModule,
		RoomModule,
		UserModule,
		AuthModule,
	],
	// controllers: [],
	// providers: [],
})
export class AppModule {}
