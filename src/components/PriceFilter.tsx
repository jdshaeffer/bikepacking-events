import { useEffect, useState } from 'react';
import Select from 'react-select';
import { FilterProps } from './FilterProps';
import filterStyles from './FilterStyles';

const options = [
  { value: 'all', label: '(any price)' },
  { value: 'free', label: 'free (or unspecified)' },
  { value: 100, label: '$100' },
  { value: 200, label: '$200' },
  { value: 300, label: '$300' },
  { value: 500, label: '$500' },
];

// TODO: assign value as a defaultOption prop to be passed in from local storage
const PriceFilter = ({ events, callback }: FilterProps) => {
  const [price, setPrice] = useState<string | number>();

  useEffect(() => {
    if (price) {
      const filteredEvents = events.filter((event) => {
        if (event.price) {
          if (event.price === 'Free') {
            return price === 'free' || price === 'all';
          } else {
            const p = +event.price.slice(1, event.price.length);
            return p <= price || price === 'all';
          }
        } else {
          return price === 'free' || price === 'all';
        }
      });
      callback(filteredEvents);
    }
  }, [price, events]);

  return (
    <div className='filter'>
      <p>price</p>
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
