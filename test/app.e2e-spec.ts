// т.к. при создании брони нужны id юзера и комнаты, соотв. все тесты разместил в одном файле.
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Types, disconnect } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from '../src/user/dto';
import { CreateRoomDto, UpdateRoomDto } from '../src/room/dto';
import {
	ERROR_USER_EXISTS,
	ERROR_USER_VALIDATION_EMAIL,
	ERROR_USER_VALIDATION_PASSWORD,
	ERROR_USER_VALIDATION_PASSWORD_IS_NOT_STRING,
} from '../src/user/user.constants';
import {
	ERROR_ROOM_AREA_IS_STRING,
	ERROR_ROOM_AREA_TOO_LESS,
	ERROR_ROOM_EXISTS,
	ERROR_ROOM_NOT_FOUND,
} from '../src/room/room.constants';
import {
	ERROR_BOOKING_DATE_ERROR,
	ERROR_BOOKING_DATE_PAST,
	ERROR_BOOKING_EXISTS,
	ERROR_BOOKING_USER_NOT_FOUNT,
} from '../src/booking/booking.constants';
import { mainConfig } from '../src/main.config';

const testUser: CreateUserDto = {
	email: 'test.e2e-1@mail.ru',
	password: 'zdf#$123',
};
const testUserUpdateData: UpdateUserDto = {
	firstName: 'Василий',
	lastName: 'Зайцев',
};

const testRoom: CreateRoomDto = {
	title: 'Комната 99999999 тест e2e',
	area: 15,
	price: 2500,
	number: 99999999,
	type: 'трехкомнатный',
};

const testRoomUpdateData: UpdateRoomDto = {
	title: 'Комната 99999999 тест e2e - UPD',
	area: 88,
	price: 888,
	type: 'однокомнатный UPD',
};

const mongoTestId = new Types.ObjectId().toHexString();

// Дата брони на сегодня
const testDateBookingNow = new Date();
const testDateBookingNowTs = Math.ceil(testDateBookingNow.getTime() / 1000);
// дата брони в прошлом
const testDateBookingPast = new Date(testDateBookingNow.setDate(testDateBookingNow.getDate() - 2));
const testDateBookingPastTs = Math.ceil(testDateBookingPast.getTime() / 1000);

describe('AppController (e2e)', () => {
	let app: INestApplication;
	let userCreatedId: string;
	let roomCreatedId: string;
	let bookCreatedId: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		mainConfig(app);
		await app.init();
		app.useLogger(new Logger());
	});

	// ####################################################################################
	// STEP 1: User
	it('/user (POST) - success', () => {
		return request(app.getHttpServer())
			.post('/user')
			.send(testUser)
			.expect(201)
			.then(({ body }: request.Response) => {
				userCreatedId = body._id;
				expect(userCreatedId).toBeDefined();
			});
	});

	// передан неправильный форма емайл
	it('/user (POST) - success', () => {
		return request(app.getHttpServer())
			.post('/user')
			.send({
				...testUser,
				email: 'not_email_format',
			})
			.expect(400)
			.then(({ body }: request.Response) => {
				const messError = body?.message.includes(ERROR_USER_VALIDATION_EMAIL);
				expect(messError).toBeTruthy();
			});
	});

	// не переданы емайл и/или пароль
	it('/user (POST) - success', () => {
		return request(app.getHttpServer())
			.post('/user')
			.expect(400)
			.then(({ body }: request.Response) => {
				const messError =
					body?.message.includes(ERROR_USER_VALIDATION_EMAIL) ||
					body?.message.includes(ERROR_USER_VALIDATION_PASSWORD) ||
					body?.message.includes(ERROR_USER_VALIDATION_PASSWORD_IS_NOT_STRING);
				expect(messError).toBeTruthy();
			});
	});

	it('/user (POST) - fail', () => {
		return request(app.getHttpServer()).post('/user').send(testUser).expect(400, {
			statusCode: 400,
			message: ERROR_USER_EXISTS,
		});
	});

	it('/user/:id (GET) - success', () => {
		return request(app.getHttpServer())
			.get(`/user/${userCreatedId}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body._id).toBe(userCreatedId);
			});
	});

	it('/user (GET) - success', () => {
		return request(app.getHttpServer())
			.get(`/user`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBeDefined();
			});
	});

	it('/user/:id (PATCH) - success', () => {
		return request(app.getHttpServer())
			.patch(`/user/${userCreatedId}`)
			.send(testUserUpdateData)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body._id).toBe(userCreatedId);
			});
	});

	// ####################################################################################
	// STEP 2: Room
	it('/room (POST) - success', () => {
		return request(app.getHttpServer())
			.post('/room')
			.send(testRoom)
			.expect(201)
			.then(({ body }: request.Response) => {
				roomCreatedId = body._id;
				expect(roomCreatedId).toBeDefined();
			});
	});

	// передаем площадь менее 1
	it('/room (POST) - success', () => {
		return request(app.getHttpServer())
			.post('/room')
			.send({
				...testRoom,
				area: 0.6,
			})
			.expect(400, {
				message: [ERROR_ROOM_AREA_TOO_LESS],
				error: 'Bad Request',
				statusCode: 400,
			});
	});

	// передаем площадь в виде строки
	it('/room (POST) - success', () => {
		return request(app.getHttpServer())
			.post('/room')
			.send({
				...testRoom,
				area: '15,6',
			})
			.expect(400, {
				message: [ERROR_ROOM_AREA_IS_STRING, ERROR_ROOM_AREA_TOO_LESS],
				error: 'Bad Request',
				statusCode: 400,
			});
	});

	// передаем площадь в виде строки
	it('/room (POST) - success', () => {
		const weakTestRoom: UpdateRoomDto = { ...testRoom };

		if (weakTestRoom?.area) delete weakTestRoom.area;
		if (weakTestRoom?.price) delete weakTestRoom.price;
		if (weakTestRoom?.title) delete weakTestRoom.title;
		if (weakTestRoom?.type) delete weakTestRoom.type;

		return request(app.getHttpServer())
			.post('/room')
			.send(weakTestRoom)
			.expect(400);
	});

	it('/room (POST) - fail', () => {
		return request(app.getHttpServer()).post('/room').send(testRoom).expect(400, {
			statusCode: 400,
			message: ERROR_ROOM_EXISTS,
		});
	});

	it('/room/:id (GET) - success', () => {
		return request(app.getHttpServer())
			.get(`/room/${roomCreatedId}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body._id).toBe(roomCreatedId);
			});
	});

	it('/room/:id (PATCH) - success', () => {
		return request(app.getHttpServer())
			.patch(`/room/${roomCreatedId}`)
			.send(testRoomUpdateData)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body._id).toBe(roomCreatedId);
			});
	});

	it('/room (GET) - success', () => {
		return request(app.getHttpServer())
			.get(`/room`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBeDefined();
			});
	});

	// ####################################################################################
	// STEP 3: Booking
	// создаем бронь
	it('/booking (POST) - success', () => {
		return request(app.getHttpServer())
			.post('/booking')
			.send({
				date: testDateBookingNowTs,
				roomId: roomCreatedId,
				userId: userCreatedId,
			})
			.expect(201)
			.then(({ body }: request.Response) => {
				bookCreatedId = body._id;
				expect(bookCreatedId).toBeDefined();
			});
	});

	// создаем бронь на туже дату
	it('/booking (POST) - fail', () => {
		return request(app.getHttpServer())
			.post('/booking')
			.send({
				date: testDateBookingNowTs,
				roomId: roomCreatedId,
				userId: userCreatedId,
			})
			.expect(400, {
				statusCode: 400,
				message: ERROR_BOOKING_EXISTS,
			});
	});

	// создаем бронь без даты
	it('/booking (POST) - fail', () => {
		return request(app.getHttpServer())
			.post('/booking')
			.send({
				roomId: roomCreatedId,
				userId: userCreatedId,
			})
			.expect(400, {
				message: [ERROR_BOOKING_DATE_ERROR],
				error: 'Bad Request',
				statusCode: 400,
			});
	});

	// создаем бронь на дату в прошлом
	it('/booking (POST) - fail', () => {
		return request(app.getHttpServer())
			.post('/booking')
			.send({
				date: testDateBookingPastTs,
				roomId: roomCreatedId,
				userId: userCreatedId,
			})
			.expect(400, {
				statusCode: 400,
				message: ERROR_BOOKING_DATE_PAST,
			});
	});

	// создаем бронь, но id комнаты не существует
	it('/booking (POST) - fail', () => {
		return request(app.getHttpServer())
			.post('/booking')
			.send({
				date: testDateBookingNowTs,
				roomId: mongoTestId,
				userId: userCreatedId,
			})
			.expect(400, {
				statusCode: 400,
				message: ERROR_ROOM_NOT_FOUND,
			});
	});

	// создаем бронь, но id пользователя не существует
	it('/booking (POST) - fail', () => {
		return request(app.getHttpServer())
			.post('/booking')
			.send({
				date: testDateBookingNowTs,
				roomId: roomCreatedId,
				userId: mongoTestId,
			})
			.expect(400, {
				statusCode: 400,
				message: ERROR_BOOKING_USER_NOT_FOUNT,
			});
	});

	// получаем все брони
	it('/booking (GET) - success', () => {
		return request(app.getHttpServer())
			.get('/booking')
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBeDefined();
			});
	});

	// получаем брони по if
	it('/booking/:id (GET) - success', () => {
		return request(app.getHttpServer())
			.get(`/booking/${bookCreatedId}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body._id).toBe(bookCreatedId);
			});
	});

	// ####################################################################################
	// STEP END: remove test data from db
	// удаление комнаты
	it('/room/:id (DELETE) - success', () => {
		return request(app.getHttpServer()).delete(`/room/${roomCreatedId}`).expect(200, {
			acknowledged: true,
			deletedCount: 1,
		});
	});
	// повторная попытка удаление комнаты по тому же id
	it('/room/:id (DELETE) - success', () => {
		return request(app.getHttpServer()).delete(`/room/${roomCreatedId}`).expect(200, {
			acknowledged: true,
			deletedCount: 0,
		});
	});

	// удаление брони
	it('/booking/:id (DELETE) - success', () => {
		return request(app.getHttpServer()).delete(`/booking/${bookCreatedId}`).expect(200, {
			acknowledged: true,
			deletedCount: 1,
		});
	});

	// повторная попытка удаление брони по тому же id
	it('/booking/:id (DELETE) - fail', () => {
		return request(app.getHttpServer()).delete(`/booking/${bookCreatedId}`).expect(200, {
			acknowledged: true,
			deletedCount: 0,
		});
	});

	// удаление пользователя
	it('/user/:id (DELETE) - success', () => {
		return request(app.getHttpServer()).delete(`/user/${userCreatedId}`).expect(200, {
			acknowledged: true,
			deletedCount: 1,
		});
	});

	// повторная попытка удаление пользователя по тому же id
	it('/user/:id (DELETE) - success', () => {
		return request(app.getHttpServer()).delete(`/user/${userCreatedId}`).expect(200, {
			acknowledged: true,
			deletedCount: 0,
		});
	});

	// disconnect from db (mongoose)
	afterAll(() => {
		disconnect();
	});
});
