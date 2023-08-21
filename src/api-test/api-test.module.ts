import { Module } from '@nestjs/common';
import { ApiTestService } from './api-test.service';

@Module({
  providers: [ApiTestService],
})
export class ApiTestModule {}
