import { UnauthorizedException, Injectable } from '@nestjs/common';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ERROR_USER_AUTH } from './auth.constants';
import { PayloadDto } from './dto/payload.dto';

@Injectable()
export class AuthService {
	constructor(private userService: UserService, private jwtService: JwtService) {}
	async signIn(payload: PayloadDto) {
		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
	async validateUser(login: string, password: string): Promise<PayloadDto> {
		const user = await this.userService.findUserRaw(login);
		if (!user) {
			throw new UnauthorizedException(ERROR_USER_AUTH);
		}
		const isCorrectPassword = await verify(user.hash, password);
		if (!isCorrectPassword) {
			throw new UnauthorizedException(ERROR_USER_AUTH);
		}
		return { sub: user.id, email: login, roles: user.roles };
	}
}
