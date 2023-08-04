import { useEffect, useState } from 'react';
import Select from 'react-select';
import { Props } from './Props';
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
const PriceFilter = ({ events, callback }: Props) => {
  const [price, setPrice] = useState<string | number>();

  useEffect(() => {
    if (price) {
      const filteredEvents = events.filter((event) => {
        if (event.price) {
          console.log(event.price);
          // const m = event.date.split(' ')[0].toLocaleLowerCase();
          // return month === m.slice(0, 3) || month === 'all';
        } else {
          console.log('no price!');
        }
        return null;
      });
      callback(filteredEvents);
    }
  }, [price, events]);

  return (
    <Select
      options={options}
      onChange={(e: any) => setPrice(e.value)}
      placeholder='select...'
      noOptionsMessage={() => 'no options'}
      styles={filterStyles}
    />
  );
};

export default PriceFilter;
