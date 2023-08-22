import { TNotifyTemplate } from '../../notifier/notify.types';

export const onBookCreateTemplate: TNotifyTemplate = {
	telegram: [
		'Комната забронирована!',
		'📅 Дата: {date}',
		'🧖‍♀️ Номер комнаты: {room_number}',
		'💵 Стоимость: {price} р.',
		'🐼 Гость: {user_name}',
		'📞 Телефон гостя: {user_phone}',
	],
	email: [
		'Комната забронирована!',
		'📅 Дата: {date}',
		'🧖‍♀️ Номер комнаты: {room_number}',
		'💵 Стоимость: {price} р.',
		'🐼 Гость: {user_name}',
		'📞 Телефон гостя: {user_phone}',
	],
	sms: [
		'Комната забронирована!',
		'📅 Дата: {date}',
		'🧖‍♀️ Номер комнаты: {room_number}',
		'💵 Стоимость: {price} р.',
		'🐼 Гость: {user_name}',
		'📞 Телефон гостя: {user_phone}',
	],
};
