import logo from '@/assets/images/logo.png';
import CoursesIcon from '@/assets/menu/courses';
import ProfileIcon from '@/assets/menu/profile';
import { logoutAtom } from '@/entities/auth/model/auth.state';
import { MenuItem } from '@/entities/layout/ui/MenuItem/MenuItem';
import { loadProfileAtom } from '@/entities/user/model/user.state';
import { UserMenu } from '@/entities/user/ui/UserMenu/UserMenu';
import { CloseDrawer } from '@/features/layout/ui/CloseDrawer/CloseDrawer';
import { CustomLink } from '@/shared/CustomLink/CustomLink';
import { Colors } from '@/shared/tokens';
import {
	DrawerContentComponentProps,
	DrawerContentScrollView,
} from '@react-navigation/drawer';
import { useAtom, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

const MENU = [
	{ text: 'Курсы', icon: <CoursesIcon />, path: 'index' },
	{ text: 'Профиль', icon: <ProfileIcon />, path: 'profile' },
];

export const CustomDrawer = (props: DrawerContentComponentProps) => {
	const logout = useSetAtom(logoutAtom);
	const [profile, loadProfile] = useAtom(loadProfileAtom);
	useEffect(() => {
		loadProfile();
	}, []);
	return (
		<DrawerContentScrollView
			{...props}
			contentContainerStyle={styles.scrollView}
		>
			<View style={styles.content}>
				<CloseDrawer {...props.navigation} />
				<UserMenu user={profile.profile} />
				{MENU.map(menu => (
					<MenuItem key={menu.path} {...menu} drawer={props} />
				))}
			</View>
			<View style={styles.footer}>
				<CustomLink href='/login' text='Выход' onPress={logout} />
				<Image style={styles.logo} source={logo} resizeMode='contain' />
			</View>
		</DrawerContentScrollView>
	);
};

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		backgroundColor: Colors.black,
	},
	content: {
		flex: 1,
		// alignItems: 'center',
		// justifyContent: 'center',
	},

	logo: {
		width: 160,
	},
	footer: {
		gap: 50,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 40,
	},
});
