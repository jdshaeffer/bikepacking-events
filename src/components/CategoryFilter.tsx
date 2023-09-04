import { useEffect, useState } from 'react';
import Select from 'react-select';
import { BikepackingEvent } from '../App';
import { FilterProps } from './FilterProps';
import filterStyles from './FilterStyles';
import SortSymbol from './SortSymbol';

const options = [
  { value: 'all', label: '(any category)' },
  { value: 'bikepacking races', label: 'races' },
  { value: 'group rides', label: 'group rides' },
  { value: 'workshops/clinics', label: 'workshops/clinics' },
  { value: 'festivals and demos', label: 'festivals/demos' },
  { value: 'talks/screenings', label: 'talks/screenings' },
];

// TODO: assign value as a defaultOption prop to be passed in from local storage
const CategoryFilter = ({
  events,
  callback,
  sortCallback,
  refreshSort,
}: FilterProps) => {
  const [category, setCategory] = useState<string>();
  const [sortDir, setSortDir] = useState<string>('');

  const handleSortChange = (dir: string) => {
    sortCallback('category');
    setSortDir(dir);
  };

  const getCategory = (event: BikepackingEvent) => {
    return event.category.toLocaleLowerCase();
  };

  useEffect(() => {
    let sortedEvents = events;
    if (sortDir) {
      sortedEvents = events.sort((eventA, eventB) => {
        const locA = getCategory(eventA);
        const locB = getCategory(eventB);
        if (sortDir === '⬆') {
          if (locA! < locB!) {
            return -1;
          } else if (locA! > locB!) {
            return 1;
          }
          return 0;
        } else {
          if (locA! > locB!) {
            return -1;
          } else if (locA! < locB!) {
            return 1;
          }
          return 0;
        }
      });
    }
    let filteredAndSortedEvents = sortedEvents;
    if (category) {
      filteredAndSortedEvents = filteredAndSortedEvents.filter((event) => {
        if (event.category) {
          const c = getCategory(event);
          return c === category || category === 'all';
        }
        return category === 'all';
      });
    }
    callback(filteredAndSortedEvents);
  }, [category, events, sortDir]);

  useEffect(() => {
    setSortDir('');
  }, [refreshSort]);

  return (
    <div className='filter'>
      <p>
        category
        <SortSymbol
          defaultAsc={false}
          callback={(dir) => handleSortChange(dir)}
          refresh={refreshSort}
        />
      </p>
      <Select
        options={options}
        onChange={(e: any) => setCategory(e.value)}
        placeholder='select...'
        noOptionsMessage={() => 'no options'}
        styles={filterStyles}
      />
    </div>
  );
};

export default CategoryFilter;
