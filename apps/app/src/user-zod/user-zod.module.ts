import { Module } from '@nestjs/common';
import { UserZodService } from './user-zod.service';
import { UserZodController } from './user-zod.controller';

@Module({
	controllers: [UserZodController],
	providers: [UserZodService],
})
export class UserZodModule {}
