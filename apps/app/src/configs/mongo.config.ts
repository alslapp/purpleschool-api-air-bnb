import { ConfigService } from '@nestjs/config';

const getMongoString = (configService: ConfigService) =>
	'mongodb://' +
	configService.get<string>('MONGO_HOST') +
	'/' +
	configService.get<string>('MONGO_AUTHDATABASE');

export const getMongoConfig = async (configService: ConfigService) => {
	console.log('mongoString: ', getMongoString(configService));
	return {
		uri: getMongoString(configService),
	};
};
