import React, { useMemo } from 'react';
import {
	Alert,
	Linking,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';

import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

import type { Contact, Place, Schedule } from '../types';

interface OverviewTabProps {
	place: Place;
}

const PHONE_TYPES = ['phone', 'tel', 'mobile'];
const WEBSITE_TYPES = ['website', 'url', 'site', 'web'];
const SOCIAL_TYPES = [
	'vk',
	'telegram',
	'instagram',
	'facebook',
	'youtube',
	'tiktok',
];

const SOCIAL_LABELS: Record<string, string> = {
	vk: 'VK',
	telegram: 'Telegram',
	instagram: 'Instagram',
	facebook: 'Facebook',
	youtube: 'YouTube',
	tiktok: 'TikTok',
};

const WEEK_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
type WeekdayKey = (typeof WEEK_ORDER)[number];

const WEEK_LABELS: Record<WeekdayKey, string> = {
	Mon: 'Пн',
	Tue: 'Вт',
	Wed: 'Ср',
	Thu: 'Чт',
	Fri: 'Пт',
	Sat: 'Сб',
	Sun: 'Вс',
};

export function OverviewTab({ place }: OverviewTabProps) {
	const contacts = useMemo(
		() =>
			place.contact_groups?.flatMap(group => group.contacts ?? []) ?? [],
		[place.contact_groups],
	);

	const phones = useMemo(
		() =>
			contacts.filter(contact =>
				PHONE_TYPES.includes(contact.type.toLowerCase()),
			),
		[contacts],
	);

	const websites = useMemo(
		() =>
			contacts.filter(contact =>
				WEBSITE_TYPES.includes(contact.type.toLowerCase()),
			),
		[contacts],
	);

	const socialLinks = useMemo(
		() =>
			contacts.filter(contact =>
				SOCIAL_TYPES.includes(contact.type.toLowerCase()),
			),
		[contacts],
	);

	const scheduleEntries = useMemo(() => {
		if (!place.schedule)
			return [] as Array<{ label: string; value: string | undefined }>;

		return WEEK_ORDER.map(day => ({
			label: WEEK_LABELS[day],
			value: place.schedule?.[day as keyof Schedule] ?? undefined,
		}));
	}, [place.schedule]);

	const hasSchedule = scheduleEntries.length > 0;
	const hasContacts =
		Boolean(place.address) || phones.length > 0 || websites.length > 0;
	const hasSocials = socialLinks.length > 0;

	const handlePhonePress = (contact: Contact) => {
		const normalized = normalizePhone(contact.value);
		Linking.openURL(`tel:${normalized}`).catch(error => {
			console.warn('Не удалось открыть номер телефона', error);
		});
	};

	const handleWebsitePress = (contact: Contact) => {
		const target = ensureHttp(contact.value);
		Linking.openURL(target).catch(error => {
			console.warn('Не удалось открыть ссылку', error);
		});
	};

	const handleReportError = () => {
		Alert.alert(
			'Спасибо!',
			'Мы передадим ваш отзыв команде и обновим данные после проверки.',
		);
	};

	return (
		<View style={styles.container}>
			{hasSchedule && (
				<View style={styles.section}>
					<AppText style={styles.sectionTitle}>Режим работы</AppText>
					{scheduleEntries.map(({ label, value }) => (
						<View key={label} style={styles.scheduleRow}>
							<AppText style={styles.scheduleDay}>
								{label}
							</AppText>
							<AppText style={styles.scheduleHours}>
								{value ?? '—'}
							</AppText>
						</View>
					))}
				</View>
			)}

			{hasContacts && (
				<View style={styles.section}>
					<AppText style={styles.sectionTitle}>Контакты</AppText>
					{place.address && (
						<AppText style={styles.sectionText}>
							{place.address.full_name || place.address.name}
						</AppText>
					)}

					{phones.map((contact, index) => (
						<TouchableOpacity
							key={`phone-${contact.value}-${index}`}
							style={styles.linkRow}
							onPress={() => handlePhonePress(contact)}
						>
							<AppText style={styles.linkText}>
								{contact.text ?? contact.value}
							</AppText>
						</TouchableOpacity>
					))}

					{websites.map((contact, index) => (
						<TouchableOpacity
							key={`website-${contact.value}-${index}`}
							style={styles.linkRow}
							onPress={() => handleWebsitePress(contact)}
						>
							<AppText style={styles.linkText}>
								{formatWebsite(contact.value)}
							</AppText>
						</TouchableOpacity>
					))}
				</View>
			)}

			{hasSocials && (
				<View style={styles.section}>
					<AppText style={styles.sectionTitle}>
						Социальные сети
					</AppText>
					<View style={styles.socialsRow}>
						{socialLinks.map((contact, index) => (
							<TouchableOpacity
								key={`social-${contact.value}-${index}`}
								style={styles.socialChip}
								onPress={() => handleWebsitePress(contact)}
							>
								<AppText style={styles.socialChipText}>
									{contact.text ??
										SOCIAL_LABELS[
											contact.type.toLowerCase()
										] ??
										formatWebsite(contact.value)}
								</AppText>
							</TouchableOpacity>
						))}
					</View>
				</View>
			)}

			{place.description && (
				<View style={styles.section}>
					<AppText style={styles.sectionTitle}>Описание</AppText>
					<AppText style={styles.sectionText}>
						{place.description}
					</AppText>
				</View>
			)}

			<View style={styles.section}>
				<AppText style={styles.sectionTitle}>Похожие места</AppText>
				<AppText style={styles.placeholderText}>
					Мы готовим подборку похожих мест — она появится совсем
					скоро.
				</AppText>
			</View>

			<TouchableOpacity
				style={styles.errorButton}
				onPress={handleReportError}
			>
				<AppText style={styles.errorButtonText}>
					Сообщить об ошибке в данных
				</AppText>
			</TouchableOpacity>
		</View>
	);
}

function normalizePhone(value: string) {
	return value.replace(/[^+\d]/g, '');
}

function ensureHttp(url: string) {
	return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function formatWebsite(value: string) {
	return ensureHttp(value)
		.replace(/^https?:\/\//i, '')
		.replace(/\/$/, '');
}

const styles = StyleSheet.create({
	container: {
		gap: Gaps.g24,
		paddingBottom: Gaps.g32,
	},
	errorButton: {
		alignItems: 'center',
		backgroundColor: Colors.grayBackground,
		borderRadius: Radius.r16,
		paddingHorizontal: Gaps.g16,
		paddingVertical: Gaps.g12,
	},
	errorButtonText: {
		color: Colors.secondaryText,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f14,
	},
	linkRow: {
		marginTop: Gaps.g8,
	},
	linkText: {
		color: Colors.greenLink,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f14,
	},
	placeholderText: {
		color: Colors.secondaryText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		marginTop: Gaps.g8,
		opacity: 0.8,
	},
	scheduleDay: {
		color: Colors.secondaryText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		width: 40,
	},
	scheduleHours: {
		color: Colors.black,
		flex: 1,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
	},
	scheduleRow: {
		flexDirection: 'row',
		marginTop: Gaps.g8,
	},
	section: {
		marginTop: Gaps.g8,
	},
	sectionText: {
		color: Colors.black,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		lineHeight: 20,
		marginTop: Gaps.g8,
	},
	sectionTitle: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f16,
	},
	socialChip: {
		backgroundColor: Colors.lightBackground,
		borderRadius: Radius.r12,
		paddingHorizontal: Gaps.g12,
		paddingVertical: Gaps.g8,
	},
	socialChipText: {
		color: Colors.greenLink,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f14,
	},
	socialsRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: Gaps.g8,
		marginTop: Gaps.g12,
	},
});
