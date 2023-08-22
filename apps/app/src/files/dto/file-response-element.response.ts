import { IsString } from 'class-validator';

export class FileElementResponse {
	@IsString()
	name: string;

	@IsString()
	url: string;
}
