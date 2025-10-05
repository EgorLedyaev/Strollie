// Вкладка с фотографиями в masonry layout

import React from 'react';
import {
	Dimensions,
	Image,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';

import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

import type { Place } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_PADDING = 16;
const GRID_WIDTH = SCREEN_WIDTH - GRID_PADDING * 2;
const GAP = 8;

interface PhotosTabProps {
	place: Place;
}

// Mock данные для демонстрации
const MOCK_PHOTOS = [
	'https://placehold.co/400x300/1FD975/white/png?text=Photo+1',
	'https://placehold.co/400x300/1CC4C4/white/png?text=Photo+2',
	'https://placehold.co/400x300/45CD86/white/png?text=Photo+3',
	'https://placehold.co/400x300/1EB18C/white/png?text=Photo+4',
	'https://placehold.co/400x300/027962/white/png?text=Photo+5',
	'https://placehold.co/400x300/3DEA90/white/png?text=Photo+6',
	'https://placehold.co/400x300/1BE07C/white/png?text=Photo+7',
];

// Размеры фото из Figma (width, height)
const PHOTO_LAYOUT = [
	{ width: 213.37, height: 216 }, // Photo 1
	{ width: 170.92, height: 216 }, // Photo 2
	{ width: 128.46, height: 172 }, // Photo 3
	{ width: 255.83, height: 172 }, // Photo 4
	{ width: 393, height: 147 }, // Photo 5 (full width)
	{ width: 186.16, height: 172 }, // Photo 6
	{ width: 198.13, height: 216 }, // Photo 7
];

export function PhotosTab({ place }: PhotosTabProps) {
	const placePhotos = place.photos?.length
		? place.photos.map(p => p.url)
		: [];
	const photos = placePhotos.length > 0 ? placePhotos : MOCK_PHOTOS;

	if (!photos || photos.length === 0) {
		return (
			<View style={styles.emptyContainer}>
				<View style={styles.emptyPlaceholder} />
			</View>
		);
	}

	// Масштабируем размеры под текущую ширину экрана
	const scale = GRID_WIDTH / 393; // 393 - ширина из Figma

	return (
		<View style={styles.container}>
			<View style={styles.grid}>
				{/* Row 1: Photo 1 + Photo 2 */}
				<View style={styles.row}>
					<Image
						source={{ uri: photos[0] }}
						style={[
							styles.photo,
							{
								width: PHOTO_LAYOUT[0].width * scale,
								height: PHOTO_LAYOUT[0].height * scale,
							},
						]}
						resizeMode='cover'
					/>
					<Image
						source={{ uri: photos[1] }}
						style={[
							styles.photo,
							{
								width: PHOTO_LAYOUT[1].width * scale - GAP,
								height: PHOTO_LAYOUT[1].height * scale,
							},
						]}
						resizeMode='cover'
					/>
				</View>

				{/* Row 2: Photo 3 + Photo 4 */}
				<View style={styles.row}>
					<Image
						source={{ uri: photos[2] }}
						style={[
							styles.photo,
							{
								width: PHOTO_LAYOUT[2].width * scale,
								height: PHOTO_LAYOUT[2].height * scale,
							},
						]}
						resizeMode='cover'
					/>
					<Image
						source={{ uri: photos[3] }}
						style={[
							styles.photo,
							{
								width: PHOTO_LAYOUT[3].width * scale - GAP,
								height: PHOTO_LAYOUT[3].height * scale,
							},
						]}
						resizeMode='cover'
					/>
				</View>

				{/* Row 3: Photo 5 (full width) */}
				<Image
					source={{ uri: photos[4] }}
					style={[
						styles.photo,
						{
							width: GRID_WIDTH,
							height: PHOTO_LAYOUT[4].height * scale,
						},
					]}
					resizeMode='cover'
				/>

				{/* Row 4: Photo 6 + Photo 7 */}
				<View style={styles.row}>
					<Image
						source={{ uri: photos[5] }}
						style={[
							styles.photo,
							{
								width: PHOTO_LAYOUT[5].width * scale,
								height: PHOTO_LAYOUT[5].height * scale,
							},
						]}
						resizeMode='cover'
					/>
					<Image
						source={{ uri: photos[6] }}
						style={[
							styles.photo,
							{
								width: PHOTO_LAYOUT[6].width * scale - GAP,
								height: PHOTO_LAYOUT[6].height * scale,
							},
						]}
						resizeMode='cover'
					/>
				</View>
			</View>

			{/* Кнопка "Добавить фото" */}
			<TouchableOpacity style={styles.addPhotoButton}>
				<AppText style={styles.addPhotoIcon}>+</AppText>
				<AppText style={styles.addPhotoText}>Добавить фото</AppText>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	addPhotoButton: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		bottom: 20,
		flexDirection: 'row',
		gap: Gaps.g8,
		paddingHorizontal: 24,
		paddingVertical: 12,
		position: 'absolute',
		right: 20,
		shadowColor: Colors.shadowButton,
		shadowOffset: { width: 2, height: 4 },
		shadowOpacity: 0.25,
		shadowRadius: 6,
	},
	addPhotoIcon: {
		color: Colors.successGreen,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f20,
	},
	addPhotoText: {
		color: Colors.successGreen,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
	},
	container: {
		flex: 1,
		paddingTop: Gaps.g16,
		position: 'relative',
	},
	emptyContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: Gaps.g48,
	},
	emptyPlaceholder: {
		backgroundColor: Colors.lightBackground,
		borderRadius: Radius.r15,
		height: 240,
		width: GRID_WIDTH,
	},
	grid: {
		gap: GAP,
	},
	photo: {
		borderRadius: Radius.r8,
	},
	row: {
		flexDirection: 'row',
		gap: GAP,
	},
});
