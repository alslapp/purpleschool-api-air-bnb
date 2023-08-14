import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room {
	@Prop({ required: true, unique: true })
	number: number;

	@Prop({ required: true })
	type: string;

	@Prop({ required: true })
	title: string;

	@Prop({ required: true })
	area: number;

	@Prop({ required: true })
	price: number;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
