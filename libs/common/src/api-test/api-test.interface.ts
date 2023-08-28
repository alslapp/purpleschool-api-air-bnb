import { ModuleMetadata } from '@nestjs/common';

export interface IApiTestOptions {
	token: string;
}

export interface IApiTestModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
	useFactory: (...args: any[]) => Promise<IApiTestOptions> | IApiTestOptions;
	inject?: any[];
}
