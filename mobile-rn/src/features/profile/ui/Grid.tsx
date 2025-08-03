import CalendarIcon from '@/assets/profile/calendar';
import RouteIcon from '@/assets/profile/route';
import SavedRouteIcon from '@/assets/profile/saved-route';
import TicketsIcon from '@/assets/profile/tickets';
import TravelsIcon from '@/assets/profile/travels';
import { StyleSheet, View } from 'react-native';

import { Colors, Fonts } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

export function Grid() {
	return (
		<View style={styles.gridContainer}>
			<View style={styles.gridRow}>
				<View style={styles.gridItem}>
					<AppText style={styles.gridText}>Мои билеты</AppText>
					<TicketsIcon style={styles.icon} />
				</View>
				<View style={styles.gridItem}>
					<AppText style={styles.gridText}>Мои поездки</AppText>
					<TravelsIcon style={styles.icon} />
				</View>
			</View>
			<View style={styles.gridRow}>
				<View style={styles.gridItem}>
					<AppText style={styles.gridText}>История маршрутов</AppText>
					<RouteIcon style={styles.icon} />
				</View>
				<View style={styles.gridItem}>
					<AppText style={styles.gridText}>
						Сохраненные маршруты
					</AppText>
					<SavedRouteIcon style={styles.icon} />
				</View>
			</View>
			<View style={styles.gridRow}>
				<View style={styles.gridItemFull}>
					<AppText style={styles.gridText}>Календарь</AppText>
					<CalendarIcon style={styles.icon} />
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	gridContainer: {
		width: '100%',
		gap: 15,
	},
	gridRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 15,
	},
	gridItem: {
		flex: 1,
		backgroundColor: Colors.white,
		padding: 20,
		height: 130,
		borderRadius: 10,
	},
	gridItemFull: {
		flex: 1,
		backgroundColor: Colors.white,
		padding: 20,
		borderRadius: 10,
		height: 130,
	},
	gridText: {
		color: Colors.black,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f18,
	},
	icon: {
		position: 'absolute',
		right: 16,
		bottom: 16,
	},
});
