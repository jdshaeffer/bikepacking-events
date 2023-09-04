import { useEffect, useState } from 'react';
import Select from 'react-select';
import { FilterProps } from './FilterProps';
import filterStyles from './FilterStyles';
import SortSymbol from './SortSymbol';
import { BikepackingEvent } from '../App';
import '../App.css';

const options = [
  { value: 'all', label: '(all distances)' },
  { value: 100, label: '100 mi' },
  { value: 250, label: '250 mi' },
  { value: 500, label: '500 mi' },
  { value: 1000, label: '1000 mi' },
  { value: 2000, label: '2000 mi' },
];

// TODO: assign value as a defaultOption prop to be passed in from local storage
const DistanceFilter = ({
  events,
  callback,
  sortCallback,
  refreshSort,
}: FilterProps) => {
  const [distance, setDistance] = useState<number | string>();
  const [sortDir, setSortDir] = useState<string>();
  // SortSymbol reads refreshSort, if true, changes direction to noSort, changes back to false immediately, else, nothing

  const handleSortChange = (dir: string) => {
    sortCallback('distance');
    setSortDir(dir);
  };

  const getDistance = (event: BikepackingEvent) => {
    return +event.distance.split('/')[0].slice(0, -3);
  };

  useEffect(() => {
    let sortedEvents = events;
    if (sortDir) {
      sortedEvents = events.sort((eventA, eventB) => {
        const disA = getDistance(eventA);
        const disB = getDistance(eventB);
        if (sortDir === '⬆') {
          return disA - disB;
        } else {
          return disB - disA;
        }
      });
    }
    let filteredAndSortedEvents = sortedEvents;
    if (distance) {
      filteredAndSortedEvents = filteredAndSortedEvents.filter((event) => {
        if (event.distance) {
          const d = getDistance(event);
          return distance.toString() === 'all' || d <= distance;
        } else {
          return event;
        }
      });
    }
    callback(filteredAndSortedEvents);
  }, [distance, events, sortDir]);

  useEffect(() => {
    setSortDir('');
  }, [refreshSort]);

  return (
    <div className='filter'>
      <p>
        distance
        <SortSymbol
          defaultAsc={false}
          callback={(dir) => handleSortChange(dir)}
          refresh={refreshSort}
        />
      </p>
      <Select
        options={options}
        onChange={(e: any) => setDistance(e.value)}
        placeholder='select...'
        noOptionsMessage={() => 'no options'}
        styles={filterStyles}
      />
    </div>
  );
};

export default DistanceFilter;
