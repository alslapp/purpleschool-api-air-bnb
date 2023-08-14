import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJWTConfig } from './configs';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies';

@Module({
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	imports: [
		UserModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJWTConfig,
		}),
		PassportModule,
	],
})
export class AuthModule {}
