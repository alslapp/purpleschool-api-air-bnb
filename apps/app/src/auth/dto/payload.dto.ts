import { Role } from '@app/common';

export type PayloadDto = {
	sub: string;
	email: string;
	roles: Role[];
};
