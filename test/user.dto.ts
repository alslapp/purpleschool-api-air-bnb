import { AuthDto } from '../src/auth/dto';
import { UpdateUserDto } from '../src/user/dto';
const dateTest = performance.now();
export const userDto: AuthDto = {
	login: `user-test-e2e-${dateTest}@domain.net`,
	password: `password_for_test_user-${dateTest}`,
};

export const adminDto: AuthDto = {
	login: `admin-test-e2e-${dateTest}@domain.net`,
	password: `password_for_test_admin-${dateTest}`,
};

export const testUserUpdateData: UpdateUserDto = {
	name: 'Василий Зайцев',
	phone: '79995552244',
};
