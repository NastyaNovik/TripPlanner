export interface Trip {
  id: number;
  title: string;
  dateFrom: string;
  dateTo: string;
  imageUrl?: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
}
