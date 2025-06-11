import {Season} from '../enums/season.enum';
import {GoogleMap} from './map';
import {CheckList} from './check-list';
import {Expense} from './expense';

export interface Trip {
  id: string;
  title: string;
  dateFrom: string;
  dateTo: string;
  imageUrl?: string;
  season: Season;
  note: string;
  map: GoogleMap;
  checkList: CheckList [];
  expenses: Expense [];
}
