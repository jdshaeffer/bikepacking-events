import { useEffect, useState } from 'react';
import Select from 'react-select';
import { FilterProps } from './FilterProps';
import filterStyles from './FilterStyles';
import SortSymbol from './SortSymbol';
import '../App.css';
import { BikepackingEvent } from '../App';

const options = [
  { value: 'all', label: '(all distances)' },
  { value: 100, label: '100 mi' },
  { value: 250, label: '250 mi' },
  { value: 500, label: '500 mi' },
  { value: 1000, label: '1000 mi' },
  { value: 2000, label: '2000 mi' },
];

// TODO: assign value as a defaultOption prop to be passed in from local storage
const DistanceFilter = ({ events, callback, sortCallback }: FilterProps) => {
  const [distance, setDistance] = useState<number | string>();
  const [sortDir, setSortDir] = useState<string>();

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
          return disB - disA;
        } else {
          return disA - disB;
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

  return (
    <div className='filter'>
      <p>
        distance
        <SortSymbol
          defaultAsc={false}
          callback={(dir) => handleSortChange(dir)}
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
