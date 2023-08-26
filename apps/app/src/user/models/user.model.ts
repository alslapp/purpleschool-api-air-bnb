import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '@app/common';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
	@Prop({ required: true, unique: true })
	email: string;

	@Prop({ type: String })
	hash: string;

	@Prop()
	name: string;

	@Prop()
	phone?: string;

	@Prop({
		type: [String],
		enum: Role,
		default: [Role.USER],
	})
	roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
