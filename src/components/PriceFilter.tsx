import { useEffect, useState } from 'react';
import Select from 'react-select';
import { BikepackingEvent } from '../App';
import { FilterProps } from './FilterProps';
import filterStyles from './FilterStyles';
import SortSymbol from './SortSymbol';

const options = [
  { value: 'all', label: '(any price)' },
  { value: 'free', label: 'free (or unspecified)' },
  { value: 100, label: '$100' },
  { value: 200, label: '$200' },
  { value: 300, label: '$300' },
  { value: 500, label: '$500' },
];

// TODO: assign value as a defaultOption prop to be passed in from local storage
const PriceFilter = ({
  events,
  callback,
  sortCallback,
  refreshSort,
}: FilterProps) => {
  const [price, setPrice] = useState<string | number>();
  const [sortDir, setSortDir] = useState<string>('');

  const handleSortChange = (dir: string) => {
    sortCallback('price');
    setSortDir(dir);
  };

  const getPrice = (event: BikepackingEvent) => {
    if (event.price === 'Free') {
      return 0;
    }
    let p = event.price.split('$');
    if (p.length !== 1) {
      return +p.pop()!;
    } else {
      p = event.price.split('£');
      if (p.length !== 1) {
        return +p.pop()!;
      } else {
        p = event.price.split('€');
        if (p.length !== 1) {
          return +p.pop()!;
        } else {
          return 0;
        }
      }
    }
  };

  useEffect(() => {
    let sortedEvents = events;
    if (sortDir) {
      sortedEvents = events.sort((eventA, eventB) => {
        const disA = getPrice(eventA);
        const disB = getPrice(eventB);
        if (sortDir === '⬆') {
          return disA! - disB!;
        } else {
          return disB! - disA!;
        }
      });
    }
    let filteredAndSortedEvents = sortedEvents;
    if (price) {
      filteredAndSortedEvents = filteredAndSortedEvents.filter((event) => {
        if (event.price) {
          if (event.price === 'Free') {
            return price === 'free' || price === 'all';
          } else {
            // need to account for dates after '/'
            // and for range prices
            const p = getPrice(event)!;
            return p <= price || price === 'all';
          }
        } else {
          return price === 'free' || price === 'all';
        }
      });
    }
    callback(filteredAndSortedEvents);
  }, [price, events, sortDir]);

  useEffect(() => {
    setSortDir('');
  }, [refreshSort]);

  return (
    <div className='filter'>
      <p>
        price
        <SortSymbol
          defaultAsc={false}
          callback={(dir) => handleSortChange(dir)}
          refresh={refreshSort}
        />
      </p>
      <Select
        options={options}
        onChange={(e: any) => setPrice(e.value)}
        placeholder='select...'
        noOptionsMessage={() => 'no options'}
        styles={filterStyles}
      />
    </div>
  );
};

export default PriceFilter;
