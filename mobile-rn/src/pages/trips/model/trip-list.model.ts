// VM и helpers только для страницы поездок (pages layer)
export interface TripCardVM {
	id: string;
	title: string;
	period: string;
	// ВАЖНО: здесь нет связки с tickets, страница сама решает что отображать
}
