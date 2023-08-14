import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect, Types } from 'mongoose';
import { mainConfig } from '../src/main.config';
import { ERROR_NOT_IS_EMAIL, ERROR_PASSWORD_EMPTY } from '../src/auth/auth.constants';
import { userDto } from './user.dto';
import { ERROR_USER_AUTH } from '../src/user/user.constants';
import { UpdateUserDto } from '../src/user/dto';

const randomId = new Types.ObjectId().toHexString();

const testUserUpdateData: UpdateUserDto = {
	name: 'Василий Зайцев',
	phone: '795656565',
};

describe('AppController (e2e)', () => {
	let app: INestApplication;
	let userId: string;
	let token: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		mainConfig(app);
		await app.init();
		app.useLogger(new Logger());
	});

	// Register
	it('/auth/register (POST) - fail', () => {
		return request(app.getHttpServer())
			.post('/auth/register')
			.send({
				login: 'login_not_email',
				password: 'asdfasdf',
			})
			.expect(400, {
				message: [ERROR_NOT_IS_EMAIL],
				error: 'Bad Request',
				statusCode: 400,
			});
	});

	it('/auth/register (POST) - fail', () => {
		return request(app.getHttpServer())
			.post('/auth/register')
			.send({
				login: 'login_email@domain.net',
				password: '',
			})
			.expect(400, {
				message: [ERROR_PASSWORD_EMPTY],
				error: 'Bad Request',
				statusCode: 400,
			});
	});

	it('/auth/register (POST) - success', () => {
		return request(app.getHttpServer())
			.post('/auth/register')
			.send(userDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				userId = body._id;
				expect(userId).toBeDefined();
			});
	});

	// Login
	it('/auth/login (POST) - fail', () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({
				login: 'login_not_email',
				password: 'asdfasdf',
			})
			.expect(400, {
				message: [ERROR_NOT_IS_EMAIL],
				error: 'Bad Request',
				statusCode: 400,
			});
	});

	it('/auth/login (POST) - fail', () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({
				login: 'login_email@domain.net',
				password: '',
			})
			.expect(400, {
				message: [ERROR_PASSWORD_EMPTY],
				error: 'Bad Request',
				statusCode: 400,
			});
	});

	it('/auth/login (POST) - fail', () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({
				login: 'login_email@domain.net',
				password: 'sdfgsdfgsdfgsdfg',
			})
			.expect(401, {
				message: ERROR_USER_AUTH,
				error: 'Unauthorized',
				statusCode: 401,
			});
	});

	it('/auth/login (POST) - success', () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(userDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				token = body.access_token;
				expect(token).toBeDefined();
			});
	});

	// Update data
	it('/user/:id (PATCH) - success', () => {
		return request(app.getHttpServer())
			.patch(`/user/${userId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(testUserUpdateData)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body._id).toBe(userId);
			});
	});

	// DELETE
	it('/user/:id (DELETE) - fail', () => {
		return request(app.getHttpServer()).delete(`/user/${userId}`).expect(401, {
			statusCode: 401,
			message: 'Unauthorized',
		});
	});

	it('/user/:id (DELETE) - fail', () => {
		return request(app.getHttpServer())
			.delete(`/user/${randomId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(403);
	});

	it('/user/:id (DELETE) - success', () => {
		return request(app.getHttpServer())
			.delete(`/user/${userId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);
	});

	afterAll(() => {
		disconnect();
	});
});
