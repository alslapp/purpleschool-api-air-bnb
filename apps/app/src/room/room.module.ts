import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './models';
import { Booking, BookingSchema } from '../booking/models';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Room.name,
				schema: RoomSchema,
			},
			{
				name: Booking.name,
				schema: BookingSchema,
			},
		]),
	],
	controllers: [RoomController],
	providers: [RoomService],
	exports: [RoomService],
})
export class RoomModule {}
