// Публичный API слайса auth-by-email
import { checkEmailAndProceedAtom } from './model/action';
import {
	registrationErrorAtom,
	registrationIsLoadingAtom,
	registrationStateAtom,
} from './model/state';
import { useAuthCheck } from './model/use-auth-check';
import { useLogin } from './model/use-login';
import { useResendCode } from './model/use-resend-code';
import { useVerifyCode } from './model/use-verify-code';

export {
	useLogin,
	useAuthCheck,
	useVerifyCode,
	useResendCode,
	registrationStateAtom,
	registrationIsLoadingAtom,
	registrationErrorAtom,
	checkEmailAndProceedAtom,
};
