import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/shared/ui';

import { useEditProfile } from '../model/useEditProfile';

interface SaveProfileButtonProps {
	onPress: () => Promise<void>;
	isDisabled?: boolean;
}

export const SaveProfileButton: React.FC<SaveProfileButtonProps> = ({
	onPress,
	isDisabled = false,
}) => {
	const { isLoading } = useEditProfile();

	return (
		<View style={styles.container}>
			<AppButton
				text='Сохранить изменения'
				onPress={onPress}
				isLoading={isLoading}
				disabled={isDisabled}
				variant='primary'
				style={styles.button}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 20,
	},
	button: {
		width: '100%',
	},
});
