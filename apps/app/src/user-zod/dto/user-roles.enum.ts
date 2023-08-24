import { z } from 'nestjs-zod/z';

export enum Role {
	USER = 'user',
	ADMIN = 'admin',
}

export const RoleEnum = z.nativeEnum(Role);
