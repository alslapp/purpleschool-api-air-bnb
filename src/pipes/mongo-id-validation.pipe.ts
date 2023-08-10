import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';
import { PIPE_ERROR_BAD_ID } from './pipes.constants';

@Injectable()
export class MongoIdValidationPipe implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata) {
		if (metadata?.data === 'id' && !value.match(/^[0-9a-fA-F]{24}$/)) {
			throw new HttpException(PIPE_ERROR_BAD_ID, HttpStatus.BAD_REQUEST);
		}
		return value;
	}
}
