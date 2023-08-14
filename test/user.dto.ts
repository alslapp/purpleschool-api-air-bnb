import { AuthDto } from '../src/auth/dto';
const dateTest = performance.now();
export const userDto: AuthDto = {
	login: `user-test-e2e-${dateTest}@domain.net`,
	password: `password_for_test_user-${dateTest}`,
};

export const adminDto: AuthDto = {
	login: `admin-test-e2e-${dateTest}@domain.net`,
	password: `password_for_test_admin-${dateTest}`,
};
