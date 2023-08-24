import { useEffect, useState } from 'react';
import Select from 'react-select';
import { FilterProps } from './FilterProps';
import filterStyles from './FilterStyles';

const options = [
  { value: 'all', label: '(any category)' },
  { value: 'bikepacking races', label: 'races' },
  { value: 'group rides', label: 'group rides' },
  { value: 'workshops/clinics', label: 'workshops/clinics' },
  { value: 'festivals and demos', label: 'festivals/demos' },
  { value: 'talks/screenings', label: 'talks/screenings' },
];

// TODO: assign value as a defaultOption prop to be passed in from local storage
const CategoryFilter = ({ events, callback }: FilterProps) => {
  const [category, setCategory] = useState<string>();

  useEffect(() => {
    if (category) {
      const filteredEvents = events.filter((event) => {
        if (event.category) {
          const c = event.category.toLocaleLowerCase();
          return c === category || category === 'all';
        }
        return category === 'all';
      });
      callback(filteredEvents);
    }
  }, [category, events]);

  return (
    <div className='filter'>
      <p>category</p>
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
