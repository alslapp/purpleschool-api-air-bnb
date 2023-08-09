import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './models';
import { Room, RoomSchema } from '../room/models';
import { User, UserSchema } from '../user/models';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Booking.name,
				schema: BookingSchema,
			},
			{
				name: Room.name,
				schema: RoomSchema,
			},
			{
				name: User.name,
				schema: UserSchema,
			},
		]),
	],
	controllers: [BookingController],
	providers: [BookingService],
})
export class BookingModule {}
