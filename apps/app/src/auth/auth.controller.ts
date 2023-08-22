import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthDto } from './dto';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { ERROR_REGISTRATION } from './auth.constants';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, private userService: UserService) {}

	@Post('register')
	async register(@Body() { login, password }: AuthDto) {
		const user = await this.userService.findUser(login);
		if (user) {
			throw new BadRequestException(ERROR_REGISTRATION);
		}
		return this.userService.createUser(login, password);
	}

	@HttpCode(HttpStatus.OK)
	@Post('login')
	async signIn(@Body() { login, password }: AuthDto) {
		const payload = await this.authService.validateUser(login, password);
		return this.authService.signIn(payload);
	}

	@Post('register-admin')
	async registerAdmin(@Body() { login, password }: AuthDto) {
		const user = await this.userService.findUser(login);
		if (user) {
			throw new BadRequestException(ERROR_REGISTRATION);
		}
		return this.userService.createAdmin(login, password);
	}
}
