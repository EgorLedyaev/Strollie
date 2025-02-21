import { LoginRequest } from '@/entities/auth/model/auth.interface';
import { loginAtom } from '@/entities/auth/model/auth.state';
import { Button } from '@/shared/Button/Button';
import { CustomLink } from '@/shared/CustomLink/CustomLink';
import { ErrorNotification } from '@/shared/ErrorNotification/ErrorNotification';
import { Input } from '@/shared/Input/Input';
import { Colors, Gaps } from '@/shared/tokens';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function Login() {
	const [localError, setLocalError] = useState<string | undefined>();
	const [email, setEmail] = useState<string>();
	const [password, setPassword] = useState<string | undefined>();
	const [{ accessToken, error, isLoading }, login] = useAtom(loginAtom);
	useEffect(() => {
		if (error) {
			setLocalError(error);
		}
	}, [error]);

	useEffect(() => {
		console.log(accessToken, login, password);
		if (accessToken) {
			router.replace('/(app)');
		}
	}, [accessToken]);

	const submit = () => {
		if (!email || !password) {
			setLocalError('Заполните все поля');
			return;
		}
		login({ email, password } as LoginRequest);
	};
	return (
		<>
			<View style={styles.container}>
				<ErrorNotification error={localError} />
				<View style={styles.content}>
					{/*<LogoIcon />*/}
					<View style={styles.form}>
						<Input placeholder='Email' onChangeText={setEmail} />
						<Input
							placeholder='Пароль'
							onChangeText={setPassword}
							isPassword
						/>
						<Button
							text='Войти'
							onPress={submit}
							isLoading={isLoading}
						/>
					</View>
					<CustomLink href='/restore' text='Восстановить пароль' />
				</View>
			</View>
		</>
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
