import {
	Prop,
	Schema,
	SchemaFactory,
} from '@nestjs/mongoose';
import {
	HydratedDocument,
	Schema as MSchema,
} from 'mongoose';
import { User } from '../../user/models';
import { Room } from 'src/room/models';
import { BookingStatusesEnum } from '../dto';

export type BookingDocument =
	HydratedDocument<Booking>;

@Schema({
	timestamps: true,
	toJSON: {
		transform(doc, ret) {
			delete ret.__v;
		},
	},
})
export class Booking {
	@Prop({ required: true, unique: true })
	date: number;

	@Prop({
		// required: true,
		type: Number,
		enum: BookingStatusesEnum,
		default: BookingStatusesEnum.NEW,
	})
	status: BookingStatusesEnum;

	@Prop({ required: true })
	price: number;

	@Prop({
		type: MSchema.Types.ObjectId,
		ref: User.name,
	})
	userId: User;

	@Prop({
		type: MSchema.Types.ObjectId,
		ref: Room.name,
	})
	roomId: Room;
}

export const BookingSchema =
	SchemaFactory.createForClass(Booking);
