import { BikepackingEvent } from '../App';

export interface FilterProps {
  events: BikepackingEvent[];
  callback: (filteredEvents: BikepackingEvent[]) => void;
  sortCallback: (filter: string) => void;
}
