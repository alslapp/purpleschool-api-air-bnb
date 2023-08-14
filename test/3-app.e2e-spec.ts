// т.к. при создании брони нужны id юзера и комнаты, соотв. все тесты разместил в одном файле.
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Types, disconnect } from 'mongoose';
import { userDto, adminDto } from './user.dto';
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
	let adminCreatedId: string;
	let roomCreatedId: string;
	let bookCreatedId: string;
	let tokenUser: string;
	let tokenAdmin: string;

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
	// STEP 1:

	// Create User
	it('/auth/register (POST) - success', () => {
		return request(app.getHttpServer())
			.post('/auth/register')
			.send(userDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				userCreatedId = body._id;
				expect(userCreatedId).toBeDefined();
			});
	});

	//Login User
	it('/auth/login (POST) - success', () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(userDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				tokenUser = body.access_token;
				expect(tokenUser).toBeDefined();
			});
	});

	// Create Admin
	it('/auth/register-admin (POST) - success', () => {
		return request(app.getHttpServer())
			.post('/auth/register-admin')
			.send(adminDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				adminCreatedId = body._id;
				expect(adminCreatedId).toBeDefined();
			});
	});

	//Login Admin
	it('/auth/login (POST) - success', () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(adminDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				tokenAdmin = body.access_token;
				expect(tokenAdmin).toBeDefined();
			});
	});

	// ####################################################################################
	// STEP 2: Room
	it('/room (POST) - fail', () => {
		return request(app.getHttpServer()).post('/room').send(testRoom).expect(401, {
			message: 'Unauthorized',
			statusCode: 401,
		});
	});

	it('/room (POST) - fail', () => {
		return request(app.getHttpServer())
			.post('/room')
			.send(testRoom)
			.set('Authorization', `Bearer ${tokenUser}`)
			.expect(403, {
				message: 'Forbidden resource',
				error: 'Forbidden',
				statusCode: 403,
			});
	});

	it('/room (POST) - success', () => {
		return request(app.getHttpServer())
			.post('/room')
			.send(testRoom)
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.expect(201)
			.then(({ body }: request.Response) => {
				roomCreatedId = body._id;
				expect(roomCreatedId).toBeDefined();
			});
	});

	// передаем площадь менее 1
	it('/room (POST) - fail', () => {
		return request(app.getHttpServer())
			.post('/room')
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.send({
				...testRoom,
				area: 0.6,
			})
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.expect(400, {
				message: [ERROR_ROOM_AREA_TOO_LESS],
				error: 'Bad Request',
				statusCode: 400,
			});
	});

	// передаем площадь в виде строки
	it('/room (POST) - fail', () => {
		return request(app.getHttpServer())
			.post('/room')
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.send({
				...testRoom,
				area: '15,6',
			})
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.expect(400, {
				message: [ERROR_ROOM_AREA_IS_STRING, ERROR_ROOM_AREA_TOO_LESS],
				error: 'Bad Request',
				statusCode: 400,
			});
	});

	// создаем без обязательных данных
	it('/room (POST) - fail', () => {
		const weakTestRoom: UpdateRoomDto = { ...testRoom };

		if (weakTestRoom?.area) delete weakTestRoom.area;
		if (weakTestRoom?.price) delete weakTestRoom.price;
		if (weakTestRoom?.title) delete weakTestRoom.title;
		if (weakTestRoom?.type) delete weakTestRoom.type;

		return request(app.getHttpServer())
			.post('/room')
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.send(weakTestRoom)
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.expect(400);
	});

	it('/room (POST) - fail', () => {
		return request(app.getHttpServer())
			.post('/room')
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.send(testRoom)
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.expect(400, {
				statusCode: 400,
				message: ERROR_ROOM_EXISTS,
			});
	});

	// получение комнаты User
	it('/room/:id (GET) - success', () => {
		return request(app.getHttpServer())
			.get(`/room/${roomCreatedId}`)
			.set('Authorization', `Bearer ${tokenUser}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body._id).toBe(roomCreatedId);
			});
	});

	// получение комнаты Admin
	it('/room/:id (GET) - success', () => {
		return request(app.getHttpServer())
			.get(`/room/${roomCreatedId}`)
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body._id).toBe(roomCreatedId);
			});
	});

	// Обновление комнаты User
	it('/room/:id (PATCH) - fail', () => {
		return request(app.getHttpServer())
			.patch(`/room/${roomCreatedId}`)
			.send(testRoomUpdateData)
			.set('Authorization', `Bearer ${tokenUser}`)
			.expect(403);
	});

	// Обновление комнаты Admin
	it('/room/:id (PATCH) - success', () => {
		return request(app.getHttpServer())
			.patch(`/room/${roomCreatedId}`)
			.send(testRoomUpdateData)
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body._id).toBe(roomCreatedId);
			});
	});

	// получение комнаты неавторизованным пользователем
	it('/room (GET) - fail', () => {
		return request(app.getHttpServer()).get(`/room`).expect(401);
	});

	// получение комнаты админом
	it('/room (GET) - success', () => {
		return request(app.getHttpServer())
			.get(`/room`)
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBeDefined();
			});
	});

	// получение комнаты неавторизованным пользователем
	it('/room (GET) - success', () => {
		return request(app.getHttpServer())
			.get(`/room`)
			.set('Authorization', `Bearer ${tokenUser}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBeDefined();
			});
	});

	// ####################################################################################
	// STEP 3: Booking

	// создаем бронь неавторизованным пользователем
	it('/booking (POST) - fail', () => {
		return request(app.getHttpServer())
			.post('/booking')
			.send({
				date: testDateBookingNowTs,
				roomId: roomCreatedId,
			})
			.expect(401);
	});

	// создаем бронь админом
	it('/booking (POST) - fail', () => {
		return request(app.getHttpServer())
			.post('/booking')
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.send({
				date: testDateBookingNowTs,
				roomId: roomCreatedId,
			})
			.expect(403);
	});

	// создаем бронь пользователем
	it('/booking (POST) - success', () => {
		return request(app.getHttpServer())
			.post('/booking')
			.set('Authorization', `Bearer ${tokenUser}`)
			.send({
				date: testDateBookingNowTs,
				roomId: roomCreatedId,
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
			.set('Authorization', `Bearer ${tokenUser}`)
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
			.set('Authorization', `Bearer ${tokenUser}`)
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
			.set('Authorization', `Bearer ${tokenUser}`)
			.send({
				date: testDateBookingPastTs,
				roomId: roomCreatedId,
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
			.set('Authorization', `Bearer ${tokenUser}`)
			.send({
				date: testDateBookingNowTs,
				roomId: mongoTestId,
			})
			.expect(400, {
				statusCode: 400,
				message: ERROR_ROOM_NOT_FOUND,
			});
	});

	// получаем все брони юзером
	it('/booking (GET) - success', () => {
		return request(app.getHttpServer())
			.get('/booking')
			.set('Authorization', `Bearer ${tokenUser}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBeDefined();
			});
	});

	// получаем все брони админом
	it('/booking (GET) - success', () => {
		return request(app.getHttpServer())
			.get('/booking')
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBeDefined();
			});
	});

	// получаем бронь по id неавторизванным пользователем
	it('/booking/:id (GET) - success', () => {
		return request(app.getHttpServer())
			.get(`/booking/${bookCreatedId}`)
			.expect(401);
	});

	// получаем бронь по id юзером
	it('/booking/:id (GET) - success', () => {
		return request(app.getHttpServer())
			.get(`/booking/${bookCreatedId}`)
			.set('Authorization', `Bearer ${tokenUser}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body._id).toBe(bookCreatedId);
			});
	});

	// получаем бронь по id админом
	it('/booking/:id (GET) - success', () => {
		return request(app.getHttpServer())
			.get(`/booking/${bookCreatedId}`)
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body._id).toBe(bookCreatedId);
			});
	});

	// ####################################################################################
	// STEP END: remove test data from db

	// удаление комнаты без авторизации
	it('/room/:id (DELETE) - fail', () => {
		return request(app.getHttpServer()).delete(`/room/${roomCreatedId}`).expect(401);
	});

	// удаление комнаты пользователем
	it('/room/:id (DELETE) - fail', () => {
		return request(app.getHttpServer())
			.delete(`/room/${roomCreatedId}`)
			.set('Authorization', `Bearer ${tokenUser}`)
			.expect(403);
	});

	// удаление комнаты админом
	it('/room/:id (DELETE) - success', () => {
		return request(app.getHttpServer())
			.delete(`/room/${roomCreatedId}`)
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.expect(200, {
				acknowledged: true,
				deletedCount: 1,
			});
	});

	// повторная попытка удаление комнаты админом по тому же id
	it('/room/:id (DELETE) - fail', () => {
		return request(app.getHttpServer())
			.delete(`/room/${roomCreatedId}`)
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.expect(200, {
				acknowledged: true,
				deletedCount: 0,
			});
	});

	// удаление брони неавторизованным пользователем
	it('/booking/:id (DELETE) - fail', () => {
		return request(app.getHttpServer()).delete(`/booking/${bookCreatedId}`).expect(401);
	});

	// удаление брони пользователем
	it('/booking/:id (DELETE) - fail', () => {
		return request(app.getHttpServer())
			.delete(`/booking/${bookCreatedId}`)
			.set('Authorization', `Bearer ${tokenUser}`)
			.expect(403);
	});

	// удаление брони админом
	it('/booking/:id (DELETE) - success', () => {
		return request(app.getHttpServer())
			.delete(`/booking/${bookCreatedId}`)
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.expect(200, {
				acknowledged: true,
				deletedCount: 1,
			});
	});

	// повторная попытка удаление брони по тому же id
	it('/booking/:id (DELETE) - fail', () => {
		return request(app.getHttpServer())
			.delete(`/booking/${bookCreatedId}`)
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.expect(200, {
				acknowledged: true,
				deletedCount: 0,
			});
	});

	// удаление User
	it('/user/:id (DELETE) - success', () => {
		return request(app.getHttpServer())
			.delete(`/user/${userCreatedId}`)
			.set('Authorization', `Bearer ${tokenUser}`)
			.expect(200, {
				acknowledged: true,
				deletedCount: 1,
			});
	});

	// удаление Admin
	it('/user/:id (DELETE) - success', () => {
		return request(app.getHttpServer())
			.delete(`/user/${adminCreatedId}`)
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.expect(200);
	});

	// disconnect from db (mongoose)
	afterAll(() => {
		disconnect();
	});
});
