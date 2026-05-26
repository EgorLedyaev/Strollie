// Публичный API слайса auth-by-email
import { checkEmailAndProceedAtom, submitUserDataAtom } from './model/action';
import {
	authErrorAtom,
	RegistrationData,
	registrationErrorAtom,
	registrationIsLoadingAtom,
	registrationStateAtom,
	verifyCodeErrorAtom,
} from './model/state';
import { useLogin } from './model/use-login';
import { useResendCode } from './model/use-resend-code';
import { useVerifyCode } from './model/use-verify-code';

export {
	useLogin,
	useVerifyCode,
	useResendCode,
	RegistrationData,
	registrationStateAtom,
	registrationIsLoadingAtom,
	registrationErrorAtom,
	checkEmailAndProceedAtom,
	submitUserDataAtom,
	verifyCodeErrorAtom,
	authErrorAtom,
};
