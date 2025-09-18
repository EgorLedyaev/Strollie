import React from 'react';

import type { Ticket } from '../model';
import { CinemaTicketCard } from './CinemaTicketCard';
import { TrainTicketCard } from './TrainTicketCard';

/**
 * Свойства компонента TicketCard
 */
interface Props {
	ticket: Ticket;
	onShowQr?: () => void;
	onMorePress?: () => void;
}

/**
 * Компонент карточки билета
 * @param props - Свойства компонента TicketCard
 * @returns
 */
export const TicketCard: React.FC<Props> = props => {
	const { ticket } = props;
	if (ticket.type === 'other') return <CinemaTicketCard {...props} />;
	if (ticket.type === 'train') return <TrainTicketCard {...props} />;
	// fallback: пока нет отдельных карточек для остальных — используем поездную компоновку
	return <TrainTicketCard {...props} />;
};

export default TicketCard;
