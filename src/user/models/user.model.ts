import {
	Prop,
	Schema,
	SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
	timestamps: true,
	toJSON: {
		transform(doc, ret) {
			delete ret.hash;
			delete ret.__v;
		},
	},
})
export class User {
	@Prop({ required: true, unique: true })
	email: string;

	@Prop({ type: String, select: false })
	hash: string;

	@Prop([String])
	images: string[];

	@Prop()
	firstName: string;

	@Prop()
	lastName: string;
}


export const UserSchema =
	SchemaFactory.createForClass(User);
