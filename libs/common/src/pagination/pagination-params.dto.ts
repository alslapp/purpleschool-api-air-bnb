import { IsNumber, Min, IsOptional, Max } from 'class-validator';
import { Type } from 'class-transformer';
import {
	PAGINATION_DEFAULT_LIMIT,
	PAGINATION_DEFAULT_SKIP,
} from '@app/common/pagination/paginations-default-params';

export class PaginationParams {
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(0)
	skip?: number = PAGINATION_DEFAULT_SKIP;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(1)
	@Max(15)
	limit?: number = PAGINATION_DEFAULT_LIMIT;
}
