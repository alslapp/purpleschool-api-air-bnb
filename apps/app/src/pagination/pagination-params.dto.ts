import { IsNumber, Min, IsOptional, Max } from 'class-validator';
import { Type } from 'class-transformer';

class PaginationParams {
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(0)
	skip?: number;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(1)
	@Max(15)
	limit?: number;
}

export default PaginationParams;
