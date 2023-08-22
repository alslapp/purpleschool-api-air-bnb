import { TNotifyTemplate } from '../../notifier/notify.types';

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
