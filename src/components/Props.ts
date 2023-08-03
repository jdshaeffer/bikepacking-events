import { BikepackingEvent } from '../App';

export interface Props {
  events: BikepackingEvent[];
  callback: (filteredEvents: BikepackingEvent[]) => void;
}
