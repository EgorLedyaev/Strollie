// Вкладка с отзывами и формой добавления

import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import { AppText, AppTextInput } from '@/shared/ui';

import { submitReview } from '../api/placeApi';
import type { Place, Review } from '../model/types';
import { usePlaceDetails } from '../model/usePlaceDetailsStore';

interface ReviewsTabProps {
	place: Place;
}

export function ReviewsTab({ place }: ReviewsTabProps) {
	const {
		userHasReviewed,
		setUserHasReviewed,
		isReviewFormVisible,
		setIsReviewFormVisible,
	} = usePlaceDetails();
	const [rating, setRating] = useState(5);
	const [reviewText, setReviewText] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const stats = place.review_stats;
	const reviews = place.reviews || [];

	const handleSubmitReview = async () => {
		if (!reviewText.trim() || isSubmitting) return;

		setIsSubmitting(true);
		try {
			await submitReview(place.id, rating, reviewText);
			setUserHasReviewed(true);
			setIsReviewFormVisible(false);
			setReviewText('');
			setRating(5);
		} catch (error) {
			console.error('Failed to submit review:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<ScrollView
			style={styles.container}
			showsVerticalScrollIndicator={false}
		>
			{stats && (
				<View style={styles.statsSection}>
					<View style={styles.ratingHeader}>
						<AppText style={styles.avgRating}>
							{stats.average_rating.toFixed(1)}
						</AppText>
						<AppText style={styles.reviewCount}>
							{stats.total_count} отзывов
						</AppText>
					</View>

					<View style={styles.distribution}>
						{[5, 4, 3, 2, 1].map(star => (
							<View key={star} style={styles.distributionRow}>
								<AppText style={styles.starLabel}>
									{star}
								</AppText>
								<View style={styles.progressBarContainer}>
									<View
										style={[
											styles.progressBar,
											{
												width: `${(stats.rating_distribution[star as keyof typeof stats.rating_distribution] / stats.total_count) * 100}%`,
											},
										]}
									/>
								</View>
								<AppText style={styles.distributionCount}>
									{
										stats.rating_distribution[
											star as keyof typeof stats.rating_distribution
										]
									}
								</AppText>
							</View>
						))}
					</View>
				</View>
			)}

			{!userHasReviewed && !isReviewFormVisible && (
				<TouchableOpacity
					style={styles.writeReviewButton}
					onPress={() => setIsReviewFormVisible(true)}
				>
					<AppText style={styles.writeReviewButtonText}>
						Отправить отзыв
					</AppText>
				</TouchableOpacity>
			)}

			{isReviewFormVisible && (
				<View style={styles.reviewForm}>
					<AppText style={styles.formTitle}>Ваш отзыв</AppText>

					<View style={styles.starSelector}>
						{[1, 2, 3, 4, 5].map(star => (
							<TouchableOpacity
								key={star}
								onPress={() => setRating(star)}
								style={styles.starButton}
							>
								<AppText
									style={
										star <= rating
											? styles.starActive
											: styles.starInactive
									}
								>
									★
								</AppText>
							</TouchableOpacity>
						))}
					</View>

					<AppTextInput
						style={styles.textInput}
						value={reviewText}
						onChangeText={setReviewText}
						placeholder='Напишите ваш отзыв...'
						placeholderTextColor={Colors.placeholderGray}
						multiline
						numberOfLines={4}
					/>

					<View style={styles.formActions}>
						<TouchableOpacity
							style={styles.cancelButton}
							onPress={() => {
								setIsReviewFormVisible(false);
								setReviewText('');
								setRating(5);
							}}
						>
							<AppText style={styles.cancelButtonText}>
								Отмена
							</AppText>
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								styles.submitButton,
								!reviewText.trim() &&
									styles.submitButtonDisabled,
							]}
							onPress={handleSubmitReview}
							disabled={!reviewText.trim() || isSubmitting}
						>
							<AppText style={styles.submitButtonText}>
								{isSubmitting ? 'Отправка...' : 'Отправить'}
							</AppText>
						</TouchableOpacity>
					</View>
				</View>
			)}

			<View style={styles.reviewsList}>
				{reviews.map(review => (
					<ReviewCard key={review.id} review={review} />
				))}
			</View>
		</ScrollView>
	);
}

interface ReviewCardProps {
	review: Review;
}

function ReviewCard({ review }: ReviewCardProps) {
	const date = new Date(review.date).toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});

	return (
		<View style={styles.reviewCard}>
			{review.is_current_user && (
				<AppText style={styles.yourReviewLabel}>Ваш отзыв</AppText>
			)}

			<View style={styles.reviewHeader}>
				<AppText style={styles.reviewerName}>
					{review.user_name}
				</AppText>
				<AppText style={styles.reviewDate}>{date}</AppText>
			</View>

			<View style={styles.starsRow}>
				{Array.from({ length: 5 }).map((_, index) => (
					<AppText
						key={index}
						style={
							index < review.rating
								? styles.starActive
								: styles.starInactive
						}
					>
						★
					</AppText>
				))}
			</View>

			<AppText style={styles.reviewText}>{review.text}</AppText>
		</View>
	);
}

const styles = StyleSheet.create({
	avgRating: {
		color: Colors.black,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f32,
	},
	cancelButton: {
		borderColor: Colors.gray,
		borderRadius: Radius.r8,
		borderWidth: 1,
		flex: 1,
		paddingVertical: 12,
	},
	cancelButtonText: {
		color: Colors.secondaryText,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f16,
		textAlign: 'center',
	},
	container: {
		flex: 1,
		paddingTop: Gaps.g16,
	},
	distribution: {
		marginTop: Gaps.g16,
	},
	distributionCount: {
		color: Colors.secondaryText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f12,
		width: 30,
	},
	distributionRow: {
		alignItems: 'center',
		flexDirection: 'row',
		marginBottom: Gaps.g8,
	},
	formActions: {
		flexDirection: 'row',
		gap: Gaps.g12,
		marginTop: Gaps.g16,
	},
	formTitle: {
		color: Colors.black,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f18,
		marginBottom: Gaps.g12,
	},
	progressBar: {
		backgroundColor: Colors.greenPrimary,
		borderRadius: Radius.r4,
		height: '100%',
	},
	progressBarContainer: {
		backgroundColor: Colors.gray,
		borderRadius: Radius.r4,
		flex: 1,
		height: 8,
		marginHorizontal: Gaps.g8,
	},
	ratingHeader: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: Gaps.g12,
	},
	reviewCard: {
		backgroundColor: Colors.lightBackground,
		borderRadius: Radius.r12,
		marginBottom: Gaps.g12,
		padding: Gaps.g16,
	},
	reviewCount: {
		color: Colors.secondaryText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
	},
	reviewDate: {
		color: Colors.secondaryText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f12,
	},
	reviewForm: {
		backgroundColor: Colors.white,
		borderColor: Colors.inputBorder,
		borderRadius: Radius.r12,
		borderWidth: 1,
		marginTop: Gaps.g16,
		padding: Gaps.g16,
	},
	reviewHeader: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: Gaps.g8,
	},
	reviewText: {
		color: Colors.black,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		lineHeight: 20,
		marginTop: Gaps.g8,
	},
	reviewerName: {
		color: Colors.black,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f16,
	},
	reviewsList: {
		marginTop: Gaps.g20,
	},
	starActive: {
		color: Colors.greenPrimary,
		fontSize: Fonts.f20,
	},
	starButton: {
		padding: 4,
	},
	starInactive: {
		color: Colors.gray,
		fontSize: Fonts.f20,
	},
	starLabel: {
		color: Colors.secondaryText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		width: 20,
	},
	starSelector: {
		flexDirection: 'row',
		gap: Gaps.g8,
		marginBottom: Gaps.g16,
	},
	starsRow: {
		flexDirection: 'row',
		gap: 4,
	},
	statsSection: {
		marginBottom: Gaps.g20,
	},
	submitButton: {
		backgroundColor: Colors.greenPrimary,
		borderRadius: Radius.r8,
		flex: 1,
		paddingVertical: 12,
	},
	submitButtonDisabled: {
		backgroundColor: Colors.disabledGray,
	},
	submitButtonText: {
		color: Colors.white,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f16,
		textAlign: 'center',
	},
	textInput: {
		backgroundColor: Colors.lightBackground,
		borderColor: Colors.inputBorder,
		borderRadius: Radius.r8,
		borderWidth: 1,
		color: Colors.black,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		minHeight: 100,
		padding: Gaps.g12,
		textAlignVertical: 'top',
	},
	writeReviewButton: {
		backgroundColor: Colors.greenPrimary,
		borderRadius: Radius.r8,
		marginTop: Gaps.g16,
		paddingVertical: 12,
	},
	writeReviewButtonText: {
		color: Colors.white,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f16,
		textAlign: 'center',
	},
	yourReviewLabel: {
		color: Colors.greenPrimary,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f12,
		marginBottom: Gaps.g8,
	},
});
