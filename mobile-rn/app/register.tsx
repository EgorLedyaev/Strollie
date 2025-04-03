import { registerAtom } from '@/entities/auth/model/auth.state';
import { AppButton } from '@/shared/Button/AppButton';
import { CustomLink } from '@/shared/CustomLink/CustomLink';
import { ErrorNotification } from '@/shared/ErrorNotification/ErrorNotification';
import { Input } from '@/shared/Input/Input';
import { Colors, Gaps } from '@/shared/tokens';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function Register() {
	const [localError, setLocalError] = useState<string | undefined>();
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');
	const [{ isSuccess, error, isLoading }, register] = useAtom(registerAtom);

	useEffect(() => {
		if (error) {
			setLocalError(error);
		}
	}, [error]);

	useEffect(() => {
		if (isSuccess) {
			router.replace('/login');
		}
	}, [isSuccess]);

	const submit = () => {
		if (!email || !password) {
			setLocalError('Введите email и пароль');
			return;
		}

		if (password !== confirmPassword) {
			setLocalError('Пароли не совпадают');
			return;
		}

		register({ email, password });
	};

	return (
		<View style={styles.container}>
			<ErrorNotification error={localError} />
			<View style={styles.content}>
				<View style={styles.form}>
					<Input placeholder='Email' onChangeText={setEmail} />
					<Input
						placeholder='Пароль'
						onChangeText={setPassword}
						isPassword
					/>
					<Input
						placeholder='Подтвердите пароль'
						onChangeText={setConfirmPassword}
						isPassword
					/>
					<AppButton
						text='Зарегистрироваться'
						onPress={submit}
						isLoading={isLoading}
					/>
				</View>
				<CustomLink href='/login' text='Уже есть аккаунт? Войти' />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 55,
		backgroundColor: Colors.white,
	},
	content: {
		alignItems: 'center',
		gap: Gaps.g50,
	},
	form: {
		alignSelf: 'stretch',
		gap: Gaps.g16,
	},
});
