import { useEffect, useState } from 'react';
import Select from 'react-select';
import { Props } from './Props';
import filterStyles from './FilterStyles';

const options = [
  { value: 'all', label: '(all distances)' },
  { value: 100, label: '100 mi' },
  { value: 250, label: '250 mi' },
  { value: 500, label: '500 mi' },
  { value: 1000, label: '1000 mi' },
  { value: 2000, label: '2000 mi' },
];

// TODO: assign value as a defaultOption prop to be passed in from local storage
// TODO: distance is optional (for non-ride events)
const DistanceFilter = ({ events, callback }: Props) => {
  const [distance, setDistance] = useState<number | string>();

  useEffect(() => {
    if (distance) {
      const filteredEvents = events.filter((event) => {
        if (event.distance) {
          const d = +event.distance.split('/')[0].slice(0, -3);
          return distance.toString() === 'all' || d <= distance;
        }
      });
      callback(filteredEvents);
    }
  }, [distance]);

  return (
    <Select
      options={options}
      onChange={(e: any) => setDistance(e.value)}
      placeholder='select...'
      noOptionsMessage={() => 'no options'}
      styles={filterStyles}
    />
  );
};

export default DistanceFilter;
