import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';
import { User } from '../../user/models';
import { Room } from '../../room/models';
import { BookingStatusesEnum } from '../dto';

export type BookingDocument = HydratedDocument<Booking>;

@Schema()
export class Booking {
	@Prop({ required: true })
	date: number;

	@Prop({
		type: String,
		enum: BookingStatusesEnum,
		default: BookingStatusesEnum.NEW,
	})
	status: BookingStatusesEnum;

	@Prop({ required: true })
	price: number;

	@Prop({
		required: true,
		type: MSchema.Types.ObjectId,
		ref: User.name,
	})
	userId: User;

	@Prop({
		required: true,
		type: MSchema.Types.ObjectId,
		ref: Room.name,
	})
	roomId: Room;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
