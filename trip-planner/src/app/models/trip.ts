import {Season} from '../enums/season.enum';

export interface Trip {
  id: string;
  title: string;
  dateFrom: string;
  dateTo: string;
  imageUrl?: string;
  season: Season;
  note: string;
}
