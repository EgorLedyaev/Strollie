import LikeIcon from '@/assets/icons/LikeIcon';
import ShareIcon from '@/assets/icons/ShareIcon';
import fallbackImage from '@/assets/images/unmatched.png';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useMemo, useState } from 'react';
import {
	Image,
	Linking,
	Share,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';

import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import { AppButton, AppText, IconButton } from '@/shared/ui';

import type { Place, TabType } from '../types';

const SUMMARY_MAX_DESCRIPTION_LENGTH = 160;

interface PlaceSummaryProps {
	place: Place;
	onBuildRoute?: (place: Place) => void;
	onOpenTab?: (tab: TabType) => void;
	onShare?: (place: Place) => void;
	onToggleFavorite?: (place: Place, nextValue: boolean) => void;
	isExpanded: boolean;
}

export function PlaceSummary({
	place,
	onBuildRoute,
	onOpenTab,
	onShare,
	onToggleFavorite,
	isExpanded,
}: PlaceSummaryProps) {
	const [isFavorite, setIsFavorite] = useState(false);

	const heroSource = useMemo(() => {
		const firstPhoto = place.photos?.[0]?.url;
		if (firstPhoto) {
			return { uri: firstPhoto } satisfies { uri: string };
		}
		return fallbackImage;
	}, [place.photos]);

	const allContacts = useMemo(
		() =>
			place.contact_groups?.flatMap(group => group.contacts ?? []) ?? [],
		[place.contact_groups],
	);

	const phoneContact = useMemo(
		() =>
			allContacts.find(contact =>
				['phone', 'tel', 'mobile'].includes(contact.type.toLowerCase()),
			) ?? null,
		[allContacts],
	);

	const websiteContact = useMemo(
		() =>
			allContacts.find(contact =>
				['website', 'url', 'site', 'web'].includes(
					contact.type.toLowerCase(),
				),
			) ?? null,
		[allContacts],
	);

	const websiteLabel = useMemo(() => {
		if (!websiteContact) return null;
		return websiteContact.text ?? formatWebsite(websiteContact.value);
	}, [websiteContact]);

	const photoCount = place.photos?.length ?? 0;
	const averageRating = place.review_stats?.average_rating ?? null;
	const reviewCount = place.review_stats?.total_count ?? 0;
	const todaySchedule = useMemo(
		() => getTodaySchedule(place.schedule),
		[place.schedule],
	);
	const shortDescription = useMemo(() => {
		if (!place.description) return null;
		if (
			place.description.length <= SUMMARY_MAX_DESCRIPTION_LENGTH ||
			isExpanded
		) {
			return place.description;
		}
		return `${place.description.slice(0, SUMMARY_MAX_DESCRIPTION_LENGTH).trim()}…`;
	}, [isExpanded, place.description]);

	const handleBuildRoute = useCallback(() => {
		if (onBuildRoute) {
			onBuildRoute(place);
		} else {
			console.log('Построить маршрут для места:', place.name);
		}
	}, [onBuildRoute, place]);

	const handlePhonePress = useCallback(() => {
		if (!phoneContact) return;
		const target = phoneContact.value.replace(/\s+/g, '');
		Linking.openURL(`tel:${target}`).catch(error => {
			console.warn('Не удалось открыть телефонный номер', error);
		});
	}, [phoneContact]);

	const handleWebsitePress = useCallback(() => {
		if (!websiteContact) return;
		const raw = websiteContact.value.trim();
		const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
		Linking.openURL(url).catch(error => {
			console.warn('Не удалось открыть сайт', error);
		});
	}, [websiteContact]);

	const handleToggleFavorite = useCallback(() => {
		setIsFavorite(prev => {
			const nextValue = !prev;
			onToggleFavorite?.(place, nextValue);
			return nextValue;
		});
	}, [onToggleFavorite, place]);

	const handleShare = useCallback(() => {
		if (onShare) {
			onShare(place);
			return;
		}
		const messageParts = [place.name];
		if (place.address?.full_name || place.address?.name) {
			messageParts.push(
				place.address.full_name ?? place.address.name ?? '',
			);
		}
		if (websiteLabel) {
			messageParts.push(websiteLabel);
		}
		Share.share({ message: messageParts.join('\n') }).catch(error => {
			console.warn('Не удалось поделиться местом', error);
		});
	}, [onShare, place, websiteLabel]);

	return (
		<View style={styles.container}>
			<View style={styles.imageWrapper}>
				<Image
					source={heroSource}
					style={styles.heroImage}
					resizeMode='cover'
				/>
				<LinearGradient
					colors={['rgba(0,0,0,0)', Colors.darkImageOverlay]}
					style={styles.imageGradient}
				/>

				<View style={styles.imageOverlay}>
					<View style={styles.photosBadge}>
						<AppText style={styles.photosBadgeText}>
							{photoCount > 0 ? `${photoCount} фото` : 'Нет фото'}
						</AppText>
					</View>
				</View>
			</View>

			<View
				style={[
					styles.infoSection,
					!isExpanded && styles.collapsedInfoSection,
				]}
			>
				<AppText style={styles.name}>{place.name}</AppText>

				{!!place.type && (
					<AppText style={styles.type}>{place.type}</AppText>
				)}

				<View style={styles.metaRow}>
					{averageRating !== null && (
						<View style={styles.chip}>
							<AppText style={styles.chipText}>
								★ {averageRating.toFixed(1)}
							</AppText>
							{reviewCount > 0 && (
								<AppText style={styles.chipSubText}>
									{` · ${reviewCount}`}
								</AppText>
							)}
						</View>
					)}

					{place.distance && (
						<View style={styles.chip}>
							<AppText style={styles.chipText}>
								{place.distance}
							</AppText>
						</View>
					)}

					{photoCount > 0 && (
						<TouchableOpacity
							style={[styles.chip, styles.actionChip]}
							onPress={() => onOpenTab?.('photos')}
						>
							<AppText style={styles.actionChipText}>
								Смотреть фото
							</AppText>
						</TouchableOpacity>
					)}
				</View>

				{place.address && (
					<AppText style={styles.address}>
						{place.address.full_name || place.address.name}
					</AppText>
				)}

				{todaySchedule && (
					<View style={styles.scheduleRow}>
						<AppText style={styles.scheduleLabel}>Сегодня:</AppText>
						<AppText style={styles.scheduleStatus}>
							{todaySchedule}
						</AppText>
					</View>
				)}

				{(phoneContact || websiteContact) && (
					<View style={styles.contactsRow}>
						{phoneContact && (
							<TouchableOpacity
								style={styles.contactChip}
								onPress={handlePhonePress}
							>
								<AppText style={styles.contactText}>
									{phoneContact.text ?? phoneContact.value}
								</AppText>
							</TouchableOpacity>
						)}
						{websiteContact && (
							<TouchableOpacity
								style={styles.contactChip}
								onPress={handleWebsitePress}
							>
								<AppText style={styles.contactText}>
									{websiteLabel ?? websiteContact.value}
								</AppText>
							</TouchableOpacity>
						)}
					</View>
				)}

				<View style={styles.actionsRow}>
					<AppButton
						text='Построить маршрут'
						onPress={handleBuildRoute}
						style={styles.routeButton}
						textFontSize={Fonts.f16}
						buttonBorderRadius={Radius.r16}
					/>
					<View style={styles.secondaryActions}>
						<IconButton
							onPress={handleToggleFavorite}
							style={styles.secondaryActionButton}
						>
							{() => (
								<LikeIcon
									color={
										isFavorite
											? Colors.likeActive
											: Colors.grayIcon
									}
								/>
							)}
						</IconButton>
						<IconButton
							onPress={handleShare}
							style={styles.secondaryActionButton}
						>
							{() => <ShareIcon color={Colors.grayIcon} />}
						</IconButton>
					</View>
				</View>

				{shortDescription && (
					<AppText style={styles.description}>
						{shortDescription}
					</AppText>
				)}

				{isExpanded && reviewCount > 0 && (
					<TouchableOpacity
						style={[styles.chip, styles.actionChip]}
						onPress={() => onOpenTab?.('reviews')}
					>
						<AppText style={styles.actionChipText}>
							Читать отзывы
						</AppText>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	actionChip: {
		backgroundColor: Colors.greenPrimary,
	},
	actionChipText: {
		color: Colors.white,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f14,
	},
	actionsRow: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: Gaps.g12,
		marginTop: Gaps.g16,
	},
	address: {
		color: Colors.black,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		marginTop: Gaps.g8,
	},
	chip: {
		alignItems: 'center',
		backgroundColor: Colors.lightBackground,
		borderRadius: Radius.r12,
		flexDirection: 'row',
		gap: Gaps.g4,
		paddingHorizontal: Gaps.g10,
		paddingVertical: 6,
	},
	chipSubText: {
		color: Colors.secondaryText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f12,
	},
	chipText: {
		color: Colors.black,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f14,
	},
	collapsedInfoSection: {
		paddingTop: Gaps.g4,
	},
	contactChip: {
		backgroundColor: Colors.lightBackground,
		borderRadius: Radius.r12,
		paddingHorizontal: Gaps.g12,
		paddingVertical: Gaps.g8,
	},
	contactText: {
		color: Colors.greenLink,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f14,
	},
	contactsRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: Gaps.g8,
		marginTop: Gaps.g12,
	},
	container: {
		gap: Gaps.g16,
	},
	description: {
		color: Colors.secondaryText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		lineHeight: 20,
		marginTop: Gaps.g12,
	},
	heroImage: {
		borderRadius: Radius.r20,
		height: 210,
		width: '100%',
	},
	imageGradient: {
		...StyleSheet.absoluteFillObject,
	},
	imageOverlay: {
		bottom: Gaps.g12,
		left: Gaps.g12,
		position: 'absolute',
		right: Gaps.g12,
	},
	imageWrapper: {
		borderRadius: Radius.r20,
		overflow: 'hidden',
		position: 'relative',
	},
	infoSection: {
		gap: Gaps.g8,
	},
	metaRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: Gaps.g8,
		marginTop: Gaps.g4,
	},
	name: {
		color: Colors.black,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f24,
	},
	photosBadge: {
		alignSelf: 'flex-end',
		backgroundColor: Colors.modalOverlay,
		borderRadius: Radius.r12,
		paddingHorizontal: Gaps.g10,
		paddingVertical: 6,
	},
	photosBadgeText: {
		color: Colors.white,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f14,
	},
	routeButton: {
		flex: 1,
		height: 48,
	},
	scheduleLabel: {
		color: Colors.secondaryText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		marginRight: Gaps.g8,
	},
	scheduleRow: {
		alignItems: 'center',
		flexDirection: 'row',
		marginTop: Gaps.g8,
	},
	scheduleStatus: {
		color: Colors.successGreen,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f14,
	},
	secondaryActionButton: {
		alignItems: 'center',
		backgroundColor: Colors.grayBackground,
		borderRadius: Radius.r16,
		height: 48,
		justifyContent: 'center',
		width: 48,
	},
	secondaryActions: {
		flexDirection: 'row',
		gap: Gaps.g8,
	},
	type: {
		color: Colors.secondaryText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		marginTop: Gaps.g4,
	},
});

function formatWebsite(value: string) {
	return value.replace(/^https?:\/\//i, '').replace(/\/$/, '');
}

function getTodaySchedule(schedule?: Place['schedule']) {
	if (!schedule) return null;

	const dayIndex = new Date().getDay();
	const map: Record<number, keyof NonNullable<Place['schedule']>> = {
		0: 'Sun',
		1: 'Mon',
		2: 'Tue',
		3: 'Wed',
		4: 'Thu',
		5: 'Fri',
		6: 'Sat',
	};
	const key = map[dayIndex];
	const value = schedule[key];
	return value ?? null;
}
