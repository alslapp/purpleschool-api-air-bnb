import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Types } from 'mongoose';
import { ID_VALIDATION_ERROR } from './decorators.constants';

export const Params = createParamDecorator((data: string, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	const params = request.params;
	if (data in params) {
		switch (data) {
			case 'id':
				if (!Types.ObjectId.isValid(params[data])) {
					throw new BadRequestException(ID_VALIDATION_ERROR);
				}
				break;
		}
	}
	return params ? params?.[data] : params;
});
