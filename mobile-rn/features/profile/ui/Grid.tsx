import CalendarIcon from '@/assets/profile/calendar';
import RouteIcon from '@/assets/profile/route';
import SavedRouteIcon from '@/assets/profile/saved-route';
import TicketsIcon from '@/assets/profile/tickets';
import TravelsIcon from '@/assets/profile/travels';
import { Colors, Fonts } from '@/shared/tokens';
import { StyleSheet, Text, View } from 'react-native';

export function Grid() {
	return (
		<View style={styles.gridContainer}>
			<View style={styles.gridRow}>
				<View style={styles.gridItem}>
					<Text style={styles.gridText}>Мои билеты</Text>
					<TicketsIcon style={styles.icon} />
				</View>
				<View style={styles.gridItem}>
					<Text style={styles.gridText}>Мои поездки</Text>
					<TravelsIcon style={styles.icon} />
				</View>
			</View>
			<View style={styles.gridRow}>
				<View style={styles.gridItem}>
					<Text style={styles.gridText}>История маршрутов</Text>
					<RouteIcon style={styles.icon} />
				</View>
				<View style={styles.gridItem}>
					<Text style={styles.gridText}>Сохраненные маршруты</Text>
					<SavedRouteIcon style={styles.icon} />
				</View>
			</View>
			<View style={styles.gridRow}>
				<View style={styles.gridItemFull}>
					<Text style={styles.gridText}>Календарь</Text>
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
