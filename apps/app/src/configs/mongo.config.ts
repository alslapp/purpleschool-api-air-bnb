import { ConfigService } from '@nestjs/config';

const getMongoString = (configService: ConfigService) =>
	'mongodb://' +
	configService.get<string>('MONGO_HOST') +
	'/' +
	configService.get<string>('MONGO_AUTHDATABASE');

export const getMongoConfig = async (configService: ConfigService) => {
	return {
		uri: getMongoString(configService),
	};
};
