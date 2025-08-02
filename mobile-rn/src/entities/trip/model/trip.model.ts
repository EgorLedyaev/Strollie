export interface Trip {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  ticketIds: string[];
  routeIds: string[];
  checklistItems: ChecklistItem[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChecklistItem {
  id: string;
  text: string;
  isChecked: boolean;
}

export const DEFAULT_CHECKLIST_ITEMS: Omit<ChecklistItem, 'id'>[] = [
  { text: 'Паспорт', isChecked: false },
  { text: 'Билеты', isChecked: false },
  { text: 'Страховка', isChecked: false },
  { text: 'Бронь жилья', isChecked: false },
  { text: 'Лекарства', isChecked: false },
];
