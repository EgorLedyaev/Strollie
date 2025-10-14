import React, { useCallback, useMemo } from 'react';
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

import type { Place, TabType } from '../types';

const SUMMARY_MAX_DESCRIPTION_LENGTH = 160;

interface PlaceSummaryProps {
	place: Place;
	onOpenTab?: (tab: TabType) => void;
	isExpanded: boolean;
}

export function PlaceSummary({
	place,
	onOpenTab,
	isExpanded,
}: PlaceSummaryProps) {
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

	return (
		<View style={styles.container}>
			<View
				style={[
					styles.infoSection,
					!isExpanded && styles.collapsedInfoSection,
				]}
			>
				<AppText
					style={[
						styles.name,
						isExpanded ? styles.nameExpanded : styles.nameCollapsed,
					]}
				>
					{place.name}
				</AppText>

				{!!place.type && (
					<AppText style={styles.type}>{place.type}</AppText>
				)}

				<View style={styles.metaRow}>
					{averageRating !== null && (
						<View style={styles.ratingBadge}>
							<AppText style={styles.ratingBadgeText}>
								★ {averageRating.toFixed(1)}
							</AppText>
							{reviewCount > 0 && (
								<AppText style={styles.ratingBadgeSubText}>
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

				{shortDescription && (
					<AppText style={styles.description}>
						{shortDescription}
					</AppText>
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
	chip: {
		alignItems: 'center',
		backgroundColor: Colors.lightBackground,
		borderRadius: Radius.r12,
		flexDirection: 'row',
		gap: Gaps.g4,
		paddingHorizontal: Gaps.g10,
		paddingVertical: 6,
	},
	chipText: {
		color: Colors.greenLink,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f12,
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
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f20,
	},
	nameCollapsed: {
		fontSize: Fonts.f24,
	},
	nameExpanded: {
		fontSize: Fonts.f20,
	},
	ratingBadge: {
		alignItems: 'center',
		backgroundColor: Colors.greenAccent,
		borderRadius: Radius.r12,
		flexDirection: 'row',
		gap: Gaps.g4,
		paddingHorizontal: Gaps.g10,
		paddingVertical: 6,
	},
	ratingBadgeSubText: {
		color: Colors.white,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f12,
	},
	ratingBadgeText: {
		color: Colors.white,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f14,
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
