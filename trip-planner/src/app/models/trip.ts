import {Season} from '../enums/season.enum';

export interface Trip {
  id: number;
  title: string;
  dateFrom: string;
  dateTo: string;
  imageUrl?: string;
  season: Season;
}
