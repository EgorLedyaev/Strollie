import { useAuth } from '@/src/entities/auth/model/auth-context';
import { AppButton } from '@/src/shared/Button/AppButton';
import { CustomLink } from '@/src/shared/CustomLink/CustomLink';
import { Input } from '@/src/shared/Input/Input';
import { Colors, Fonts } from '@/src/shared/tokens';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function signIn() {
	useEffect(() => {
		console.log('SignIn screen mounted');
	}, []);
	const signIn = () => {
		router.replace('/(app)');
	};
	return (
		<>
			<View style={styles.container}>
				<Text style={styles.text}>Вход</Text>
				<View style={{ gap: 24 }}>
					<View>
						<Text>E-mail</Text>
						<Input />
					</View>
					<View>
						<Text>Пароль</Text>
						<Input />
					</View>
					<View style={{ alignSelf: 'flex-end', paddingTop: 16 }}>
						<CustomLink href='/restore' text='Забыли пароль?' />
					</View>
				</View>
				<AppButton text='Войти' onPress={signIn} />
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						paddingHorizontal: 20,
						paddingVertical: 32,
					}}
				>
					<View
						style={{
							flex: 1,
							height: 2,
							backgroundColor: Colors.gray,
						}}
					/>
					<Text
						style={{
							marginHorizontal: 10,
							color: Colors.darkGray,
						}}
					>
						или
					</Text>
					<View
						style={{
							flex: 1,
							height: 2,
							backgroundColor: Colors.gray,
						}}
					/>
				</View>
				<View>
					<Text
						style={{
							textAlign: 'center',
							color: Colors.lightGray,
							paddingBottom: 16,
						}}
					>
						Войти с помощью
					</Text>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
						}}
					>
						<View
							style={{
								backgroundColor: Colors.gray,
								width: 110,
								height: 54,
							}}
						/>
						<View
							style={{
								backgroundColor: Colors.gray,
								width: 110,
								height: 54,
							}}
						/>
						<View
							style={{
								backgroundColor: Colors.gray,
								width: 110,
								height: 54,
							}}
						/>
					</View>
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: Colors.lightBackground,
		justifyContent: 'center',
		fontFamily: Fonts.semibold,
	},
	text: {
		color: Colors.black,
		fontSize: 24,
		fontWeight: 'bold',
	},
});
