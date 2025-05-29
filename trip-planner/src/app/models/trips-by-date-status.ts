import {Trip} from './trip';

export interface TripsByDateStatus {
  upcoming: Trip[];
  past: Trip[];
}
