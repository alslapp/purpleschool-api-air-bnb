import { Role } from '../../user/dto/user-roles.enum';

export type PayloadDto = {
	sub: string;
	email: string;
	roles: Role[];
};
