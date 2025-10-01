// Типы для работы с данными о местах из 2GIS API

export interface Coordinates {
	lat: number;
	lon: number;
}

export interface Address {
	name: string;
	full_name?: string;
	building_name?: string;
}

export interface ContactGroup {
	type: string;
	contacts: Contact[];
}

export interface Contact {
	type: string;
	value: string;
	text?: string;
}

export interface Schedule {
	Mon?: string;
	Tue?: string;
	Wed?: string;
	Thu?: string;
	Fri?: string;
	Sat?: string;
	Sun?: string;
}

export interface Photo {
	id: string;
	url: string;
	preview_url?: string;
	width?: number;
	height?: number;
}

export interface Review {
	id: string;
	user_name: string;
	user_photo?: string;
	rating: number;
	text: string;
	date: string;
	is_current_user?: boolean;
}

export interface ReviewStats {
	average_rating: number;
	total_count: number;
	rating_distribution: {
		5: number;
		4: number;
		3: number;
		2: number;
		1: number;
	};
}

export interface Place {
	id: string;
	name: string;
	type: string;
	address: Address;
	point: Coordinates;
	contact_groups?: ContactGroup[];
	schedule?: Schedule;
	photos?: Photo[];
	reviews?: Review[];
	review_stats?: ReviewStats;
	distance?: string;
	description?: string;
}

export type TabType = 'overview' | 'photos' | 'reviews';

export interface PlaceDetailsState {
	selectedPlace: Place | null;
	currentTab: TabType;
	isExpanded: boolean;
	userHasReviewed: boolean;
	isReviewFormVisible: boolean;
}
