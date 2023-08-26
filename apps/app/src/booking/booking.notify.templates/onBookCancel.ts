import { TNotifyTemplate } from '../../notifier/notify.types';

// Не понял задумку с шаблонными строками JS - переменные book, room, user не определены
// а когда будут определены, хз как они будут называться, может userNew, или bookDeleted и т.п.
// оставил в виде массива строк, но затипизировал методы
// const tlgTest = [
// 	`Комната забронирована!`,
// 	`📅 Дата: ${book.date}`,
// 	`🧖‍♀️ Номер комнаты: ${room.number}`,
// 	`💵 Стоимость: ${book._price} р.`,
// 	`🐼 Гость: ${user.name}`,
// 	`📞 Телефон гостя: {user_phone}`,
// ];

export const onBookCancelTemplate: TNotifyTemplate = {
	telegram: [
		'Бронь комнаты отменена!',
		'📅 Дата: {date}',
		'🧖‍♀️ Номер комнаты: {room_number}',
		'💵 Стоимость: {price} р.',
		'🐼 Гость: {user_name}',
		'📞 Телефон гостя: {user_phone}',
	],
	email: [
		'Бронь комнаты отменена!',
		'📅 Дата: {date}',
		'🧖‍♀️ Номер комнаты: {room_number}',
		'💵 Стоимость: {price} р.',
		'🐼 Гость: {user_name}',
		'📞 Телефон гостя: {user_phone}',
	],
	sms: [
		'Бронь комнаты отменена!',
		'📅 Дата: {date}',
		'🧖‍♀️ Номер комнаты: {room_number}',
		'💵 Стоимость: {price} р.',
		'🐼 Гость: {user_name}',
		'📞 Телефон гостя: {user_phone}',
	],
};
