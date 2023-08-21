import { ConfigService } from '@nestjs/config';

const getMongoString = (configService: ConfigService) =>
	'mongodb://' +
	// configService.get('MONGO_LOGIN') +
	// ':' +
	// configService.get('MONGO_PASSWORD') +
	// '@' +
	configService.get<string>('MONGO_HOST') +
	':' +
	configService.get<number>('MONGO_PORT') +
	'/' +
	configService.get<string>('MONGO_AUTHDATABASE');

export const getMongoConfig = async (configService: ConfigService) => ({
	uri: getMongoString(configService),
});
